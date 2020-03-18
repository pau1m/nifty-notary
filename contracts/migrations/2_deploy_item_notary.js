const ItemNotary = artifacts.require('ItemNotary');
const ECDSA = artifacts.require('ECDSA')
const RelayHub = artifacts.require("IRelayHub");

const config = require(__dirname+'/./../config');

console.log(config);
// Format of async deploy JS adapted from https://github.com/trufflesuite/truffle/issues/501#issuecomment-373886205
module.exports = (deployer) => {
  console.log(deployer.network_id);
  deployer.then(async () => {

    console.log(deployer.network_id);
    const accounts = await web3.eth.getAccounts();
    const deployAccount = web3.eth.accounts.privateKeyToAccount(config.deployKey)['address'] || accounts[0];
    const signerAccount = web3.eth.accounts.privateKeyToAccount(config.signKey)['address'];

    await deployer.deploy(ECDSA);
    await deployer.link(ECDSA, ItemNotary);
    await deployer.deploy(ItemNotary);

    const itemNotary = await ItemNotary.deployed();
    console.log('Contract deployed at: ', itemNotary.address);
    //@todo move this setup to next 3_xxx deployer item
    const relayHub = new web3.eth.Contract(RelayHub.abi, config.relayHub);

    if (config.initialGSNFunding > 0) {
      await relayHub.methods.depositFor(itemNotary.address).send({
        from: deployAccount, // @todo from config
        value: web3.utils.toWei(config.initialGSNFunding, 'ether')
      });
    }

    if (deployer.network_id === 666) {

      await itemNotary.updateRegistry(accounts[0], true);
      await itemNotary.updateRegistry(accounts[1], true);
      await itemNotary.updateRegistry(accounts[2], true);
    }
    // If live or Ropsten
    if (deployer.network_id === 1 || deployer.network_id === 3) {
      // Add default signing key to account.
      const defaultAccount = await itemNotary.updateRegistry(signerAccount, true);
      console.log('default account', defaultAccount)
    }
  })
};