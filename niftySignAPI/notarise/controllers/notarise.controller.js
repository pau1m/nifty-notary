const NotaryItemModel = require('../models/notaryItem.model.js');
const crypto = require('crypto');

exports.insert = (req, res) => {
    // let salt = crypto.randomBytes(16).toString('base64');
    //     // let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    //     // req.body.password = salt + "$" + hash;
    //     // req.body.permissionLevel = 1;

    // spit out the
    // send base64 encoded...
    // verify...
    // res add debugging....

    req.body.file = 'Rm9vQm9vTW9vR2xvbw==';
    req.body.tokenId = 'boo';
    req.body.onChain = false;
    req.body.id = 'xxx';

    res.status(201).send(req.body);

    // pending further execution...
    // allow the user to poll
    // must return a promise.. should use observables

    // NotaryItemModel.createItem(req.body)
    //     .then((result) => {
    //         res.status(201).send({id: result._id});
    //        // res.status(201).send({id: 'xxxxxx'});
    //     });

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

exports.getById = (req, res) => {
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