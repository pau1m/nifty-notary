const NotaryItemModel = require('../models/notaryItem.model.js');
const crypto = require('crypto');
const { generate } = require('ethereumjs-wallet');





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


// const web3  =

// const { fromInjected, fromConnection } = require(’@openzeppelin/network’);
// const injected = await fromConnection(‘infura-io-url’, {
//     gsn: { signKey: “xxx” }
// });
// const instance = new injected.lib.eth.Contract(abi, address);
// const tx = await instance.methods.mint().send({
//     from: address
// });
//console.log(tx);

// @todo do web3 stuff here and then move elsewhere...

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
    const Web3 = require('web3');
    const web3 = new Web3('http://localhost:8545');
    const notaryArtifacts = require('../../../contracts/build/contracts/Notary');
    // const accounts = await web3.eth.getAccounts();
    // const networkId = await web3.eth.net.getId();
    const accounts = await web3.eth.getAccounts();
    const networkId = await web3.eth.net.getId();
    const contractAddress = notaryArtifacts.networks[networkId].address;
    const notaryContract = await new web3.eth.Contract(notaryArtifacts.abi, contractAddress);
    const fooby = await web3.eth.sendTransaction({to: contractAddress, from: accounts[0], value: web3.utils.toWei('1', 'ether')})
    const balance = await web3.eth.getBalance(contractAddress);

    // any issues we should be able to address right in here
    const foop = generate().privKey;


// const {
//     deployRelayHub,
//     runRelayer,
//     fundRecipient,
// } = require('@openzeppelin/gsn-helpers');

//const { utils, GSNProvider } = require("@openzeppelin/gsn-provider");
//const { generate } = require("ethereumjs-wallet");
    const { GSNProvider } = require("@openzeppelin/gsn-provider");
    const gsnProvider = new GSNProvider("http://localhost:8545", {
        signKey: '0x2219082ae071dc68723e2b5b82e766662c9a6217e9357cc3da4363a8b7fa3611'  // we also need the address of hub here, no?
    });

   // const { generate } = require("ethereumjs-wallet");

    web3.setProvider(gsnProvider);





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
    const docHash = '0x' + crypto.createHash('sha256').update(req.body.doc).digest('hex');

    // mebs should try
    const addedHashReceipt = await notaryContract.methods.testRelay().send({ from: accounts[0], gas: 4000000 });
    const notaryReceipt = await notaryContract.methods.relayNotarise('boo@example.com', 0, docHash/*'0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687'*/).send({from: accounts[0], gas: 4000000});
    // console.log('foo', foo);

   // const docHash = crypto.createHash('sha256').update(req.body.doc).digest('hex');

    // make the request here!!!!!

   // here we can populate

    // this is a lot of data to store on chain
    // really need to check all of these things -- makes think worth using typescript
    req.body.txStatus = txState.success;
    req.body.confirmations = 1; //@todo actual
    req.body.docHash = docHash;
    req.body.txId = notaryReceipt.transactionHash;

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
            res.status(203).send(req.body);
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

exports.submitToChain = (req, res) => {

    console.log('SUBMITTING TO CHAIN')
};

exports.getById = (req, res) => {
    NotaryItemModel.findById(req.params.hash)
        .then((result) => {
            res.status(200).send(result);
        });
};



//@todo
exports.fetchByTxId = (req, res) => {
    NotaryItemModel.findById(req.params.hash)
        .then((result) => {
            res.status(200).send(result);
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