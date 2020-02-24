require('dotenv').config({path:__dirname+'/./../../../.env' });

// CHECK TO SEE IF WE ARE ON A TEST INSTANCE
// CANT DEBUG THE CONTRACT ID

module.exports = {

    "signKey": process.env.SIGN_KEY,
    "seedPhrase": process.env.SEED_PHRASE,
    "nodeEndPoint": process.env.NODE_HTTP_ENDPOINT,
    "relayHub": process.env.GSN_HUB,
    "notaryContract": process.env.NOTARY_CONTRACT,
    "port": 3600,
    "appEndpoint": "http://localhost:3600",
    "apiEndpoint": "http://localhost:3600",
    "jwt_secret": process.env.JWT_SECRET,
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "PAID_USER": 4,
        "ADMIN": 2048
    },
    testPassword: process.env.TEST_PASSWORD,
    testEmail: process.env.TEST_EMAIL,
    testFirstName: process.env.TEST_FIRST_NAME,
    testLastName: process.env.TEST_LAST_NAME
};
