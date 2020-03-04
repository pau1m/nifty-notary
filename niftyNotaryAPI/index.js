const config = require('./common/config/env.config.js');
// @todo merge these into one
require('dotenv').config({path:__dirname+'/./../.env' });


// pullin and export with that othwer thing
// require('dotenv').config({ path: require('find-config')('.env') })
// console.log(process.env);
// console.log(poo);
// how can we process this to displau important informaiton
// should create a js file that pulls om merge and exports
// from a single file...
// read a bit more throoughly
// https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
//     https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const AuthorizationRouter = require('./authorization/routes.config');
const UsersRouter = require('./users/routes.config');
const NotariseRouter = require('./notarise/routes.config.js')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); // @todo restrict...
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

app.use(bodyParser.json());
AuthorizationRouter.routesConfig(app);
UsersRouter.routesConfig(app);
NotariseRouter.routesConfig(app); //@todo deal with not returned promise issue
// have a look at how middleware should be implemented


app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
