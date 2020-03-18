const NotariseController = require('./controllers/notarise.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
// const FREE = config.permissionLevels.NORMAL_USER;

//@todo how to do we implement requests and request limit?

// @todo make route root /notary
// giving post: /notary/notarise
// and get /notary/\


// So we basically just have to make all of these end points work
// mebs should be doing postman instead of
// can potentially just add admin and ignore piad just now
// verification should be able to happen without a user having to auth mebs...

    exports.routesConfig = async function (app) {
    app.post('/notarise/file', [
        ValidationMiddleware.validJWTNeeded,
       //  PermissionMiddleware.minimumPermissionLevelRequired(PAID), // not yet implemented
        NotariseController.insertFile
    ]);

    app.post('/notarise/hash', [
        ValidationMiddleware.validJWTNeeded,
        NotariseController.insertHash
    ]);

    // @todo
    // app.post('/notarise/hashWithSecret', [
    //     ValidationMiddleware.validJWTNeeded,
    //     NotariseController.insertHash
    // ]);
    //
    // app.post('/verify/hashWithSecret', [
    //     ValidationMiddleware.validJWTNeeded,
    //     NotariseController.insertHash
    // ]);

        /*


        exports.recoverSigner = async (req, res) => {

         */

    app.get('/notarised/recoverSigner/:fileHash/:signature', [
        NotariseController.recoverSigner,
    ]);

    // @todo not sure whether should also use api token on gets
    app.get('/notarised/getById/:id', [
      //  PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        ValidationMiddleware.validJWTNeeded,
        NotariseController.getById,

        // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        // UsersController.list
    ]);

    app.get('/notarised/getByTxId/:txId', [
        NotariseController.getByTxId
        // ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        // UsersController.list
    ]);

    app.get('/notarised/getByHash/:fileHash', [
        NotariseController.getByFileHash
        // ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        // UsersController.list
    ]);

    app.get('/transaction/getByTxId/:txId', [
        NotariseController.fetchTxByTxId
        // ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        // UsersController.list
    ]);

    app.post('/notarised/verify', [
        NotariseController.verifyHash
    ]);

    // @todo rename all the endpoints for consistancy
    // app.post('/notarise-basic', [
    //     NotariseController.insertAnonBasic
    // ]);

    // app.get('/notarise/getById/:id', [
    //    NotariseController.getById
    //    // ValidationMiddleware.validJWTNeeded,
    //    // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    //    // UsersController.list
    // ]);

    // app.get('/notarise/dbid/:dbid', [
    //     NotariseController.getById
    //     // ValidationMiddleware.validJWTNeeded,
    //     // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    //     // UsersController.list
    // ]);

    // app.get('/notarise/getTxByTxId/:txId', [
    //     NotariseController.fetchTxByTxId
    //     // ValidationMiddleware.validJWTNeeded,
    //     // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    //     // UsersController.list
    // ]);

    //


    // app.post('/notarise/verify', [
    //
    //     // provide verification service
    //     // NotariseController.insert
    //     // create a model for the thing that we want
    // ]);

    // need to fill out other endpoints






    // app.get('/users/:userId', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    //     PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    //     UsersController.getById
    // ]);
    // app.patch('/users/:userId', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    //     PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    //     UsersController.patchById
    // ]);
    // app.delete('/users/:userId', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    //     UsersController.removeById
    // ]);
};
