//@todo additional setup?
//@todo take values from config
const ItemNotary = artifacts.require('ItemNotary');
const ECDSA = artifacts.require('ECDSA')

// const { fundRecipient } = require('@openzeppelin/gsn-helpers');
const RelayHub = artifacts.require("IRelayHub");

const config = require(__dirname+'/./../config');

// Format of async deploy JS adapted from https://github.com/trufflesuite/truffle/issues/501#issuecomment-373886205
//@todo live deployment take values from env
// have to take private key and use to add register
module.exports = (deployer) => {

  deployer.then(async () => {

    const accounts = await web3.eth.getAccounts();

    await deployer.deploy(ECDSA);
    await deployer.link(ECDSA, ItemNotary);
    await deployer.deploy(ItemNotary);

    const itemNotary = await ItemNotary.deployed();
    console.log('Contract deployed at: ', itemNotary.address);

    const relayHub = new web3.eth.Contract(RelayHub.abi, '0xD216153c06E857cD7f72665E0aF1d7D82172F494'/*(config.relayHub*/);
    await relayHub.methods.depositFor(itemNotary.address).send({
      from: accounts[0], // @todo from config
      value: web3.utils.toWei('0.2', 'ether')
    });

    //@todo remove in prod
    await itemNotary.updateRegistry(accounts[0], true);
    await itemNotary.updateRegistry(accounts[1], true);
    await itemNotary.updateRegistry(accounts[2], true);
  })
};