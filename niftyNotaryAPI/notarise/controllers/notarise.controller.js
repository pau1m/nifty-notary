const config = require('../../common/config/env.config');
console.log('c: ', config);

const NotaryItemModel = require('../models/notaryItem.model.js');
const crypto = require('crypto');
// const { generate } = require('ethereumjs-wallet');
const notaryArtifacts = require('../../../contracts/build/contracts/Notary');

const Web3 = require('web3');
const web3 = new Web3(config.nodeEndPoint);
const signerAccount = web3.eth.accounts.wallet.add(config.signKey);

//
// console.log(config.signKey)
// console.log(config.signKey)
// console.log(web3.eth.accounts.wallet.add(config.signKey));
// console.log(web3.eth.accounts[0])
// console.log(web3.eth.getAccounts())
/*
const Web3 = require('web3');
//const notaryArtifacts = require('../../../contracts/build/contracts.json')
// hardcode values just now and go back to env vars later
const web3 = new Web3('http://localhost:8545');
/*const networkId = web3.eth.net.getId();*/
// const accounts =
//
// // async web3.eth.net.getId();
// // must be an easier way to get this
// console.log(web3);






// const {
//     deployRelayHub,
//     runRelayer,
//     fundRecipient,
// } = require('@openzeppelin/gsn-helpers');

//const { utils, GSNProvider } = require("@openzeppelin/gsn-provider");
//const { generate } = require("ethereumjs-wallet");
// const { GSNProvider } = require("@openzeppelin/gsn-provider");
// const gsnProvider = new GSNProvider("http://localhost:8545", {
//     signKey: '0x2219082ae071dc68723e2b5b82e766662c9a6217e9357cc3da4363a8b7fa3611'  // we also need the address of hub here, no?
// });
// const notaryArtifacts = require('../../../contracts/build/contracts/Notary');
// web3.setProvider(gsnProvider);


// this will only work in these early stages where we have a single network
//const networkId = notaryArtifacts[Object.keys(notaryArtifacts)[0]];

// web3.eth.net
//@todo in ganache set network_id
// pass param --network_id
// cant embed here becos asunc

// console.log('grarrrrrr', web3.eth.net.getId())
//const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, notaryArtifacts.networks[web3.eth.net.getId()].address);
// const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, notaryArtifacts.networks['1581421274860'].address);
// notaryContract.methods.relayNotarise('boo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687').send({from: web3.eth.accounts[2], gas: 4000000});
// console.log(notaryContract);
// 1581421274860
//create the contract
$pi = 3;
// create new contract


// so we still have to create an actual contract to be used
// and also add a user in the deployment


// we need to set this to local so we know what is happening



/*

const { utils, GSNProvider } = require("@openzeppelin/gsn-provider");

const gsnProvider = new GSNProvider({
  approveFunction: utils.makeApproveFunction(data => web3.eth.sign(data, approver))
});
 */


// const { fromInjected, fromConnection } = require(’@openzeppelin/network’);
// const injected = await fromConnection(‘infura-io-url’, {
//     gsn: { signKey: “xxx” }
// });
// const instance = new injected.lib.eth.Contract(abi, address);
// const tx = await instance.methods.mint().send({
//     from: address
// });

const txState = {
    sending: 'sending', // just getting things going, not yet submitted
    pending: 'pending', // submitted onchain
    success: 'success',
    failed: 'failed',
    confirming: 'confirming', // mined but waiting a few blocks before confirming
    rejected: 'rejected'
};

// @todo we need conffig for deployment... should be a shared env thing

exports.insert = async (req, res) => {

    console.log(await web3.eth.getAccounts())
 //   const web3 = new Web3('http://localhost:8545');
 //   const notaryArtifacts = require('../../../contracts/build/contracts/Notary');
    // const accounts = await web3.eth.getAccounts();
    // const networkId = await web3.eth.net.getId();
  //  const accounts = await web3.eth.getAccounts(); // ahhhh... here is the problem we can't get accounts from web3 because we are on ropsten and its not a local node
  //  const networkId = await web3.eth.net.getId();

    //  SO THIS FALLS OVER IN OUT TEST INSTANCE
    // IN THE CONFIG SETUP WE CAN CHECK THE NETWORK ID
  // AND IF IT IS OUR TEST ID IT CONFIGURES WITH DIFFERENT SETTINGS
    const contractAddress = config.notaryContract; //notaryArtifacts.networks[networkId].address;
    const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, contractAddress);
    // this should already be funded on the hub
    // const fundingContract = await web3.eth.sendTransaction({to: contractAddress, from: accounts[0], value: web3.utils.toWei('1', 'ether')})
    const balance = await web3.eth.getBalance(contractAddress);

    // any issues we should be able to address right in here
    // const foop = generate().privKey;
        // add account 0- to sign key and it weill get used automaticallt

// const {
//     deployRelayHub,
//     runRelayer,
//     fundRecipient,
// } = require('@openzeppelin/gsn-helpers');

    //@todo at the moment we justhave one key in the system that signs
    //in future we can allow signings via metamask or create other account on behalf of users

//const { utils, GSNProvider } = require("@openzeppelin/gsn-provider");
//const { generate } = require("ethereumjs-wallet");
    const { GSNProvider } = require("@openzeppelin/gsn-provider");
    //@todo  this should be derived from seedPhrase
    const gsnProvider = new GSNProvider(config.nodeEndPoint, {
        signKey:  config.signKey  // we also need the address of hub here, no?
    });

    web3.setProvider(gsnProvider);


   // console.log(accounts[0])


    // let salt = crypto.randomBytes(16).toString('base64');
    //     // let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    //     // req.body.password = salt + "$" + hash;
    //     // req.body.permissionLevel = 1;
    // const accounts = await web3.eth.getAccounts();
    // const networkId = await web3.eth.net.getId();
    // const notaryContract = await new web3.eth.Contract(notaryArtifacts.abi, notaryArtifacts.networks[networkId].address);
    // const fooby = await web3.eth.sendTransaction({to: notaryContract.address, from: accounts[0], value: web3.utils.toWei('1', 'ether')})

    // this.recipient.setProvider(gsnProvider);
    // should use keccak instead... since is standard for smart contracts

    // get email
    const docHash = '0x' + crypto.createHash('sha256').update(req.body.file).digest('hex');

    // mebs should try
    // const addedHashReceipt = await notaryContract.methods.testRelay().send({ from: accounts[0], gas: 4000000 });


    // quick hack
    req.body.userId = 'poo';
    let notaryReceipt = {}
    try {
        notaryReceipt = await notaryContract.methods.relayNotarise(req.body.userId/*'boo@example.com'*/, 0, docHash/*'0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687'*/).send({from: signerAccount.address, gas: 4000000});
    }
    catch(e) {
        if (e.message.indexOf('Hash already recorded')) {
          res.status('422').send(e.message);
          return;
        }
    }
      const pie = 3;
    // deal with rejection
    // @todo we should handle receipt in case where the item has already been posted


     // const notaryReceipt = await notaryContract.methods.relayNotarise(req.body.userId/*'boo@example.com'*/, 0, docHash/*'0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687'*/).send({from: accounts[0], gas: 4000000});
      // console.log('foo', foo);

     // const docHash = crypto.createHash('sha256').update(req.body.doc).digest('hex');

      // make the request here!!!!!

     // here we can populate

      // this is a lot of data to store on chain
      // really need to check all of these things -- makes think worth using typescript
    req.body.txStatus = txState.success;
    req.body.confirmations = 1; //@todo actual
    req.body.docHash = docHash;
    req.body.txId = notaryReceipt.transactionHash || null;

    // need some sort of front end
    // should this be JS...

    // @todo change name to encoded doc
    // @todo all we should really care
    // @todo resolve why db not connecting
    // @todo write some script to push data to ethereum and back
    // @todo solidify what we need to receieve and what we need to send back.

     NotaryItemModel.createItem(req.body)
        .then((result) => {
            req.body.dbId = result._id.toHexString();

            // uhmmmmm. ... did we used to use sign and send...
            // have a look at teh other projects we've worked on...
            // eeesh feels like such a long time want to cry
            // do it in tests...
            // deploy this to rinkeby and make it work....
            // from there can use other approach
            //notary = new web3.eth.Contract(notary.abi, notary.address);
            // submit on chain
            // send via meta transactions -- requires other stuff to be setup
            // do we really need token in the responese
            // !!!! does this actually send at this point or does the response object continue to get passed through
            //console.log('RES: ', req.body);
                res.status(203).send(req.body); // @todo 20x?
        })
         .catch((e) => {
            console.log('exception: ', e);
         });
    //res.status(203).send(response);

    // pending further execution...
    // allow the user to poll
    // must return a promise.. should use observables



    // go ahead and push it to the chain
};

// potentially can use approval instead of a registtration == https://www.npmjs.com/package/@openzeppelin/gsn-provider
// exports.list = (req, res) => {
//     let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
//     let page = 0;
//     if (req.query) {
//         if (req.query.page) {
//             req.query.page = parseInt(req.query.page);
//             page = Number.isInteger(req.query.page) ? req.query.page : 0;
//         }
//     }
//     UserModel.list(limit, page)
//         .then((result) => {
//             res.status(200).send(result);
//         })
// };

exports.insertAnonBasic = async (req, res) => {

  const contractAddress = config.notaryContract; //notaryArtifacts.networks[networkId].address;
  const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, contractAddress);
  //const balance = await web3.eth.getBalance(contractAddress);
  const { GSNProvider } = require("@openzeppelin/gsn-provider");
  const gsnProvider = new GSNProvider(config.nodeEndPoint, {
    signKey:  config.signKey  // we also need the address of hub here, no?
  });

  web3.setProvider(gsnProvider);

  //@todo use keccak
  const docHash = '0x' + crypto.createHash('sha256').update(req.body.file).digest('hex');

  // mebs should try
  // const addedHashReceipt = await notaryContract.methods.testRelay().send({ from: accounts[0], gas: 4000000 });

  let notaryReceipt = {}
  try {
    notaryReceipt = await notaryContract.methods.relayAnonProofOfExistence(docHash).send({from: signerAccount.address, gas: 4000000}); // calculate what this should be
  }
  catch(e) {
    if (e.message.indexOf('Hash already recorded')) {
      res.status('422').send(e.message);
      return;
    }
  }

  // @todo get txStatus from tx
  // do we have to calculate hash for ourselves ? that would work well when not mined yet
  req.body.txStatus = txState.success;
  req.body.confirmations = 1; //@todo actual
  req.body.docHash = docHash;
  req.body.txId = notaryReceipt.transactionHash || '0x0';

  NotaryItemModel.createItem(req.body)
    .then((result) => {
      req.body.dbId = result._id.toHexString();


      // we probably want the time stamp
      // timestamp
      // dbid
      // tx id
      // dbid
      // should we also include the hash type in the db or on chain?
      res.status(200).send(req.body);
    })
    .catch((e) => {
      console.log('exception: ', e);
    });

};

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
        });
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

            // grab what we can in human readable form...
            // how should we handle this!????
            const parsedEvents = parseLog(receipt.logs, abiEventList);
            receipt.parsedEvents = parsedEvents;

            res.status(200).send(receipt);
        })
        .catch((e) => {
            console.error('Could not retrieve receipt ', e);
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

exports.verifyHash = (req, res) => {
  res.sendStatus(200).send('it works');
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