require('dotenv').config({path:__dirname+'/./../.env' });

module.exports =  {
  seedPhrase: process.env.SEED_PHRASE,
  nodeEndPoint: process.env.NODE_HTTP_ENDPOINT,
  relayHub: process.env.GSN_HUB,
  notaryContract: process.env.NOTARY_CONTRACT,
  deployKey: process.env.DEPLOY_KEY,
  infuraKey: process.env.INFURA_KEY
};