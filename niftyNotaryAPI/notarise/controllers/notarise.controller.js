const config = require('../../common/config/env.config');
console.log('c: ', config);

const NotaryItemModel = require('../models/notaryItem.model.js');
const crypto = require('crypto');
// const { generate } = require('ethereumjs-wallet');
const notaryArtifacts = require('../../../contracts/build/contracts/ItemNotary');

const Web3 = require('web3');
const web3 = new Web3(config.nodeEndPoint);
const signerAccount = web3.eth.accounts.wallet.add(config.signKey);

const txState = {
    sending: 'sending', // just getting things going, not yet submitted
    pending: 'pending', // submitted onchain
    success: 'success',
    failed: 'failed',
    confirming: 'confirming', // mined but waiting a few blocks before confirming
    rejected: 'rejected',
    fail: 'fail'
};

exports.insertFile = async (req, res) => {

  const contractAddress = config.notaryContract; //notaryArtifacts.networks[networkId].address;
  const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, contractAddress);

  const { GSNProvider } = require("@openzeppelin/gsn-provider");
  const gsnProvider = new GSNProvider(config.nodeEndPoint, {
    signKey:  config.signKey  // we also need the address of hub here, no?
  });
  web3.setProvider(gsnProvider);

  //@todo  get hash method sha256 and keccak
  const fileHash = '0x' + crypto.createHash('sha3-256').update(req.body.file).digest('hex');

  //  const roo = await web3.eth.getTransactionCount(signerAccount.address, 'pending');
  let notaryReceipt = {};
  try {
    notaryReceipt = await notaryContract.methods.storeItem(fileHash, 1, '').send({
      from: signerAccount.address,
      gas: 50000,
     // gasPrice: web3.utils.toWei('40', 'gwei'),
    //  nonce: 1 + await web3.eth.getTransactionCount(signerAccount.address, "pending")
    });
    let $pi = 3;
  }
  catch(e) { //@todo test this... line and make sure it works
    if (e.message.indexOf('Hash already recorded') !== -1) {
      return res.status('422').send(e.message);

    }
    // @todo add proper default clause
    return res.status('422').send(e.message);

  }

  // Insert stuff to db
  req.body.txStatus = txState.success;
  req.body.confirmations = 1; //@todo actual
  req.body.fileHash = fileHash;
  req.body.txId = notaryReceipt.transactionHash || '0x0';

  // get type from contract response

  // Prepare response
  const response = {
    txStatus: txState.success,
    fileHash: fileHash,
    hashType: 'sha3-256',
    docType: 'text/plain', //@todo remove this
    txId: notaryReceipt.transactionHash || null,
    chainId: 1, // as below
    timestamp: Date.now() // @todo derive from receipt -- mebs check block :/
  };

  // @TODO EVERY HOUR WE COULD HASH THESE IN TO A MERCKLE TREE AND JUST STORE THAT

  NotaryItemModel.createItem(req.body)
    .then((result) => {
      response.id = result._id.toHexString();
      res.status(200).send(response); // @todo 20x?
    })
    .catch((e) => {
      console.log('exception: ', e);
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

  //@todo  get hash method sha256 and keccak
  //const docHash = '0x' + crypto.createHash('sha256').update(req.body.file).digest('hex');

  let notaryReceipt = {};
  try {
    notaryReceipt = await notaryContract.methods.storeItem(req.body.hash, 1, '').send({from: signerAccount.address, gas: 4000000});
    const p = 3.1;
    if (notaryReceipt.status === false) {
      res.sendStatus(400);
      return;
    }
  }
  catch(e) {
    if (e.message.indexOf('Hash already recorded') !== -1) {
      res.status('422').send(e.message);
    } else {
      res.status('422').send(e.message);
    }
    //@todo: default clause
  }

  // if txStatus = false
  // unable to create object

  req.body.txStatus = notaryReceipt.status;
  req.body.confirmations = 1; //@todo actual or scrubb it
  req.body.fileHash = req.body.hash; //@todo undo dup
  req.body.txId = notaryReceipt.transactionHash || null;
  req.body.gasUsed = notaryReceipt.gasUsed || null;

  // Prepare response
  const response = {
    txStatus: txState.success,
    fileHash: req.body.hash,
    hashType: 'sha3-256',
    docType: 'text/plain', // @todo rename to fileType
    txId: notaryReceipt.transactionHash || null,
    chainId: 1, // as below
    timestamp: Date.now() // @todo derive from receipt -- mebs check block :/
  };

  //@todo actually we really really need to know the chain id otherwise can not create a link

  NotaryItemModel.createItem(req.body)
    .then((result) => {
      req.body.dbId = result._id.toHexString();
      res.status(200).send(response); // @todo 20x?
    })
    .catch((e) => {
      res.status(400).send(e.message)
      // console.log('exception: ', e);
    });
};


//     // const accounts = await web3.eth.getAccounts();
//     // const networkId = await web3.eth.net.getId();
//   //  const accounts = await web3.eth.getAccounts(); // ahhhh... here is the problem we can't get accounts from web3 because we are on ropsten and its not a local node
//   //  const networkId = await web3.eth.net.getId();


exports.submitToChain = (req, res) => {

    console.log('SUBMITTING TO CHAIN')
};


//@todo retrieve data after posting it from the id
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
  //@todo make sure we get all the stuff back that we need
  // so we can post the same data as we get when we do a post
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

    // res.status(200).send(await web3.eth.getTransactionReceipt(req.params.txId));
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

//@todo confirm based on type!!!
exports.verifyHash = (req, res) => {
  const docHash = '0x' + crypto.createHash('sha3-256').update(req.body.file).digest('hex');
  if (docHash === req.body.fileHash) {
    // @todo strip stuff from body if necessary
    // should it be base64 with type?
    res.sendStatus(200).send({matches: true});
  } else {
    res.sendStatus(404).send({matches: false});
  }
};



//@todo allow creation of tx to be signed or could add a wrapper around something for client to do ny self

// exports.patchById = (req, res) => {
//     if (req.body.password) {
//         let salt = crypto.randomBytes(16).toString('base64');
//         let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
//         req.body.password = salt + "$" + hash;
//     }
//
//     UserModel.patchUser(req.params.userId, req.body)
//         .then((result) => {
//             res.status(204).send({});
//         });
//
// };
//
// exports.removeById = (req, res) => {
//     UserModel.removeById(req.params.userId)
//         .then((result)=>{
//             res.status(204).send({});
//         });
// };