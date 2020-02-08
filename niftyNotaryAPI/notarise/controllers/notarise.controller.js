const NotaryItemModel = require('../models/notaryItem.model.js');
const crypto = require('crypto');

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

exports.insert = (req, res) => {
    // let salt = crypto.randomBytes(16).toString('base64');
    //     // let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    //     // req.body.password = salt + "$" + hash;
    //     // req.body.permissionLevel = 1;

    const docHash = crypto.createHash('sha256').update(req.body.doc).digest('hex');

    // this is a lot of data to store on chain
    // really need to check all of these things -- makes think worth using typescript
    req.body.txStatus = txState.pending;
    req.body.docHash = docHash;
    req.body.txId = '0x0';

    // @todo change name to encoded doc
    // @todo all we should really care
    // @todo resolve why db not connecting
    // @todo write some script to push data to ethereum and back
    // @todo solidify what we need to receieve and what we need to send back.

     NotaryItemModel.createItem(req.body)
        .then((result) => {
            req.body.dbId = result._id.toHexString();
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
exports.verifyTransacitonByTxId = (req, res) => {
    NotaryItemModel.findById(req.params.hash)
        .then((result) => {
            res.status(200).send(result);
        });
};
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