const config = require('../../common/config/env.config');
const crypto = require('crypto');
console.log('c: ', config);
const ethService = require('../../common/services/ethereum.service');

const NotaryItemModel = require('../models/notaryItem.model.js');
const notaryArtifacts = require('../../../contracts/build/contracts/ItemNotary');
const Web3 = require('web3');
const web3 = new Web3(config.nodeEndPoint);
const signerAccount = web3.eth.accounts.wallet.add(config.signKey);
const itemTypes = require('../../common/config/itemTypes');

//@todo intended for future use when when handling batching and responding to gas costs.
// const txState = {
//   sending: 'sending', // just getting things going, not yet submitted
//   pending: 'pending', // submitted onchain
//   success: 'success',
//   failed: 'failed',
//   confirming: 'confirming', // mined but waiting a few blocks before confirming
//   rejected: 'rejected',
//   fail: 'fail'
// };


// mebs add an object that has a list of gas estimates...
// can enforce it here!!!!!! what types do we expect

const nullBytes = '0x0';
const emptyString = '';

// @todo should
// @todo add typing
// uhmmm.... how are we going to verify or encrypt with other types????
// what if we have passed a file
// @todo
const hashData = (data, hashType) => {
  hashType.toLowerCase();

  if (['sha3-256', 'sha256'/*, 'passphrase'*/].indexOf(hashType) === -1) {
    throw "Unknown encryption type";
  }

  return  '0x' + crypto.createHash(hashType).update(data).digest('hex');
};

exports.insertFile = async (req, res) => {

   const contractAddress = config.notaryContract; //notaryArtifacts.networks[networkId].address;
   const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, contractAddress);

   // const notaryContract = await ethService.getWeb3NotaryContract();
   // console.log(notaryContract);
  // const notaryContract = ethService.getWeb3NotaryContract();
  //const notaryContract = ethService.addGSNProviderToContract(ethService.getWeb3NotaryContract());

  const { GSNProvider } = require("@openzeppelin/gsn-provider");
  const gsnProvider = new GSNProvider(config.nodeEndPoint, {
    signKey:  config.signKey  // we also need the address of hub here, no?
  });
  web3.setProvider(gsnProvider);

  const hashType = 'sha3-256';
  const fileHash = hashData(req.body.file, hashType);
  let notaryReceipt = {};
  try {
    console.log('*****TYPE', itemTypes[hashType])
   // console.log('Gas Estimate', await notaryContract.methods.storeItem(fileHash, itemTypes[hashType], emptyString, nullBytes).estimateGas({from: signerAccount.address}));
    notaryReceipt = await notaryContract.methods.storeItem(fileHash, itemTypes[hashType], emptyString, nullBytes).send({
      from: signerAccount.address,
      gas: '80000',
     // gasPrice: web3.utils.toWei('40', 'gwei'),
     // nonce: await web3.eth.getTransactionCount(signerAccount.address, "pending")
    });
    console.log('file receipt: ', notaryReceipt);

  }
  catch(e) {

    if (e.message.indexOf('Hash already recorded') !== -1) {
      return res.status('422').send(e.message);
    }

    return res.status('400').send(e.message);
  }

  // notaryReceipt
  // Insert stuff to db
  req.body.txStatus = notaryReceipt.status;
  req.body.fileHash = fileHash;
  req.body.txId = notaryReceipt.transactionHash || nullBytes;

  const response = {
    txStatus: req.body.txStatus,
    fileHash: fileHash,
    hashType: req.body.hashType,
    docType: req.body.docType || emptyString,
    contractAddress: config.notaryContract,
    txId: req.body.txId || nullBytes,
    chainId: 1, // as below
    timestamp: Date.now() // @todo derive from receipt -- mebs check block :/
  };

  NotaryItemModel.createItem(req.body)
    .then((result) => {
      response.id = result._id.toHexString();
      return res.status(201).send(response); // @todo 20x?
    })
    .catch((e) => {
      console.error('exception: ', e);
      return res.sendStatus(400);
    });
};

// this should be in the controller or the database
exports.insertHash = async (req, res) => {
  const contractAddress = config.notaryContract; //notaryArtifacts.networks[networkId].address;
  const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, contractAddress);

  const { GSNProvider } = require("@openzeppelin/gsn-provider");
  const gsnProvider = new GSNProvider(config.nodeEndPoint, {
    signKey:  config.signKey  // we also need the address of hub here, no?
  });

  web3.setProvider(gsnProvider);

  let notaryReceipt = {};
  const hashType = itemTypes[req.body.hashType] || itemTypes['exists'];
  const link  = req.body.link || emptyString;
  const signature = req.body.signature || nullBytes;

  try {
    // console.log(await web3.eth.getTransactionCount(signerAccount.address, "pending"))
    notaryReceipt = await notaryContract.methods.storeItem(req.body.hash, hashType, link, signature).send({from: signerAccount.address, gas: '200000'});
    console.log('hash receipt: ', notaryReceipt)
    if (notaryReceipt.status === false) {
      return res.sendStatus(400);
    }
  }
  catch(e) {
    console.error('file fail: ', e)
    if (e.message.indexOf('Hash already recorded') !== -1) {
      return res.status('422').send(e.message);
    }
    return res.sendStatus('400');  //.send(e.message);
  }
  // if txStatus = false
  // unable to create object
  req.body.chainId = config.chainId;
  req.body.txStatus = notaryReceipt.status;
  req.body.fileHash = req.body.hash;
  req.body.txId = notaryReceipt.transactionHash || null;
  req.body.gasUsed = notaryReceipt.gasUsed || null; // required for billing

  const response = {
    txStatus: req.body.txStatus,
    fileHash: req.body.hash,
    signature: req.body.signature || nullBytes,
    link: req.body.link || emptyString,
    hashType: hashType,
 //   docType: req.body.docType || 'application/octet-stream', // generic term for any blob of data
    txId: notaryReceipt.transactionHash || null,
    chainId: config.chainId,
    timestamp: Date.now(), // @todo derive from receipt -- mebs check block :/
    explorer: 'https://etherscan.io/tx/' + notaryReceipt.transactionHash
  };

  //@todo derive link from chain id
  NotaryItemModel.createItem(req.body)
    .then((result) => {
      req.body.dbId = response.id = result._id.toHexString();
      // response.id = re
      return res.status(200).send(response);
    })
    .catch((e) => {
      return res.status(400).send(e.message)
    });
};

exports.getById = (req, res) => {
    //@todo make sure we get all the stuff back that we need
    // so we can post the same data as we get when we do a post
    NotaryItemModel.findById(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        })
      .catch(() => {
          res.sendStatus(404);
      })
};

exports.getByFileHash = (req, res) => {

  NotaryItemModel.findByFileHash(req.params.fileHash)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((e) => {
      res.sendStatus(404)
    })
};

exports.getByTxId = (req, res) => {

  NotaryItemModel.findByTxId(req.params.txId)
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((e) => {
      res.sendStatus(404)
    })
};

  exports.fetchTxByTxId = async (req, res) => {
    const ethAbi = require('ethereumjs-abi');
    const notaryAbi = notaryArtifacts.abi;
    const { parseLog } = require('ethereum-event-logs');
    //const abiEventLst = notaryAbi.map(item => item.type === 'event' ? item.type: null);
    // const abiEventList2 = notaryAbi.reduce((acc, item) => {
    //     if (item.type === 'event') {
    //         acc += item;
    //     }
    // });
    const abiEventList = notaryAbi.filter(item => item.type === 'event');

    web3.eth.getTransactionReceipt(req.params.txId)
        .then((receipt) => {
            // @todo should do something useful with parsed logs.
            const parsedEvents = parseLog(receipt.logs, abiEventList);
            receipt.parsedEvents = parsedEvents;
            res.status(200).send(receipt);
        })
        .catch((e) => {
            console.error('Could not retrieve receipt ', e);
            res.status(400).send(e);
        });
};



/*
* Verify on chain. Specifics of an id.
*
* */
exports.verifyTransactionByTxId = (req, res) => {
    NotaryItemModel.findById(req.params.hash)
        .then((result) => {
            res.status(200).send(result);
        });
};

// @todo verifyFileHash
exports.verifyHash = (req, res) => {
  const docHash = '0x' + crypto.createHash('sha3-256').update(req.body.file).digest('hex');
  if (docHash === req.body.fileHash) {
    res.sendStatus(200).send({matches: true});
  } else {
    res.sendStatus(404).send({matches: false});
  }
};

exports.recoverSigner = async (req, res) => {

  const signer = await web3.eth.accounts.recover(req.params.fileHash, req.params.signature, false);
  console.log('signer', signer);
  // check is not 0x
  // check for bad data
  // send 40x where appropriate
  if (signer) {
    return res.status(200).send({signer: signer});
  } else {
    return res.sendStatus(400);
  }
};