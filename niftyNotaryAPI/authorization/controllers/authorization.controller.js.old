const jwtSecret = require('../../common/config/env.config.js').jwt_secret,  jwt = require('jsonwebtoken');   // wtf with comma???
const crypto = require('crypto');
const uuid = require('uuid'); // unused


// then we can login for out test cases

// refactoring to make more flexible and testable
// make sure we populate body with enough data to sign
exports.prepareLogin = (req) => {
    let refreshId = req.body.userId + jwtSecret;
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
    req.body.refreshKey = salt;
    let token = jwt.sign(req.body, jwtSecret);
    let b = new Buffer(hash);
    let refresh_token = b.toString('base64');
    return ({accessToken: token, refreshToken: refresh_token});
};

exports.login = (req, res) => {
    try {
        const tokens = prepareLogin(req);
        // let refreshId = req.body.userId + jwtSecret;
        // let salt = crypto.randomBytes(16).toString('base64');
        // let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        // req.body.refreshKey = salt;
        // let token = jwt.sign(req.body, jwtSecret);
        // let b = new Buffer(hash);
        // let refresh_token = b.toString('base64');
        res.status(201).send(tokens/*{accessToken: token, refreshToken: refresh_token}*/);
    } catch (err) {
        res.status(500).send({errors: err});
    }
};

exports.refresh_token = (req, res) => {
    try {
        req.body = req.jwt;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(201).send({id: token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
};
