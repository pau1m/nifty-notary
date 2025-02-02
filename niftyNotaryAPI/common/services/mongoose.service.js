const mongoose = require('mongoose');
const config = require('../config/env.config');
let count = 0;

const options = {
    autoIndex: true, // Rebuild indexes every time -- @todo disable for live
    useCreateIndex: true,
    // reconnectTries: 30, // Retry up to 30 times
    // reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    //geting rid off the depreciation errors
    useNewUrlParser: true,
    useUnifiedTopology: true
    
};

const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    // changed to 'localhost' from 'mongo'
    //@todo adding a localhosts entry for mongo would also fix and may be preferable
    // need to amend this for also to work in docker container if thats how we choose to deploy...
    mongoose.connect(config.mongoUrl/*"mongodb://localhost:27017/test2"*/, options).then(() => {
        console.log('MongoDB is connected')
    }).catch( err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
