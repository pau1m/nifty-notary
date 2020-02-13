const config = require('./common/config/env.config.js');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// const AuthorizationRouter = require('./authorization/routes.config');
// const UsersRouter = require('./users/routes.config');
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
// AuthorizationRouter.routesConfig(app);
// UsersRouter.routesConfig(app);
NotariseRouter.routesConfig(app);
// have a look at how middleware should be implemented


app.listen(config.port, function () {
    console.log('app listening at port %s', config.port);
});
