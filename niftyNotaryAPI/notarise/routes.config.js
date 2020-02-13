const NotariseController = require('./controllers/notarise.controller');
// const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
// const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

// const ADMIN = config.permissionLevels.ADMIN;
// const PAID = config.permissionLevels.PAID_USER;
// const FREE = config.permissionLevels.NORMAL_USER;

    // so we should have an ethereum bridge...

// @todo make route root /notary
// giving post: /notary/notarise
// and get /notary/


exports.routesConfig = async function (app) {
    app.post('/notarise', [
        NotariseController.insert,
        NotariseController.submitToChain


        // can write it in place and then refactor to here
        // create a model for the thing that we want
    ]);
    app.get('/notarise/hash/:hash', [
       NotariseController.getById
       // ValidationMiddleware.validJWTNeeded,
       // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
       // UsersController.list
    ]);

    app.get('/notarise/dbid/:dbid', [
        NotariseController.getById
        // ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        // UsersController.list
    ]);

    app.get('/notarise/txid/:txid', [
        NotariseController.getById
        // ValidationMiddleware.validJWTNeeded,
        // PermissionMiddleware.minimumPermissionLevelRequired(PAID),
        // UsersController.list
    ]);

    app.post('/notarise/verify', [

        // provide verification service
        // NotariseController.insert
        // create a model for the thing that we want
    ]);
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
