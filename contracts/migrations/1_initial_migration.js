const Migrations = artifacts.require("Migrations");
const Notary = artifacts.require("Notary");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Notary);
};

// post deployment... authorise a


/*

_2

https://docs.openzeppelin.com/cli/2.6/truffle

const { scripts, ConfigManager } = require('@openzeppelin/cli');
const { add, push, create } = scripts;

async function deploy(options) {
  add({ contractsData: [{ name: 'Counter', alias: 'Counter' }] });
  await push(options);
  await create(Object.assign({ contractAlias: 'Counter' }, options));
}

module.exports = function(deployer, networkName, accounts) {
  deployer.then(async () => {
    const { network, txParams } = await ConfigManager.initNetworkConfiguration({ network: networkName, from: accounts[0] })
    await deploy({ network, txParams })
  })
}

 */