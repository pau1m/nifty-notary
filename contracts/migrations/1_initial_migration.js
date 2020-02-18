// @todo refqctor in to multiple files 1_migrations 2_contracts 3_setup

const Migrations = artifacts.require("Migrations");
const Notary = artifacts.require("Notary");
// const { fundRecipient } = require('@openzeppelin/gsn-helpers');
const RelayHub = artifacts.require("IRelayHub");

const config = require(__dirname+'/./../config');
// context of execution loses config :/ not sure how to add it
// console.log('why no config? ', config);

// Format of async deploy JS adapted from https://github.com/trufflesuite/truffle/issues/501#issuecomment-373886205
module.exports = (deployer) => {
  deployer.then(async () => {
    const accounts = await web3.eth.getAccounts();

    await deployer.deploy(Migrations);
    await deployer.deploy(Notary);

    const notary = await Notary.deployed();
    console.log('Contract deployed at: ', notary.address);

    const relayHub = new web3.eth.Contract(RelayHub.abi, '0xD216153c06E857cD7f72665E0aF1d7D82172F494'/*config.relayHub*/);
    await relayHub.methods.depositFor(notary.address).send({
      from: accounts[0],
      value: web3.utils.toWei('0.2', 'ether')
    });

    await notary.updateRegistry(accounts[0], true);
    await notary.updateRegistry(accounts[1], true);
    await notary.updateRegistry(accounts[2], true);
  })
};

/*  deployer.deploy(Migrations);
  deployer.deploy(Notary)
      .then(async (notary) => {
          // console.log('NOT: ', notary);
          // console.log(web3.eth.accounts);
            const accounts = await web3.eth.getAccounts();
        // do we have to pass anything in?
       // await notary.initialize();
       //  return new web3.eth.Contract(data.relayHub.abi, address || data.relayHub.address, {
       //    data: data.relayHub.bytecode,
       //    ...options,
       //  });

            // create web3 of relay hub
        //
            const relayHub = new web3.eth.Contract(RelayHub.abi, config.relayHub);
            const funded = await relayHub.methods.depositFor(notary.address).send({from: accounts[0], value: web3.utils.toWei('0.2', 'ether')});

            // so, perhaps intiialise is the correct way to do this, send fund to be forwarde
            // cannot only use this for tes deployments
            // need to add instructiosn here for different ways to deploy
           //  await fundRecipient(web3, { recipient: notary.address, amount: web3.utils.toWei('1', 'ether') })
            await notary.updateRegistry(accounts[0], true);
            await notary.updateRegistry(accounts[1], true);
            await notary.updateRegistry(accounts[2], true);
        // deployed contract stuff
        // whittle this down to one -- just want these for testing just now


        //   web3.eth.sendTransaction({to:notary.address, from: web3.eth.accounts[0], value:web3.toWei(amount,"ether")}, function(err1, resp1){
        //       if(err1){
        //           console.log(err1);
        //       }
        //       else{
        //           console.log(resp1);
        //       }
        //   });
        // console.log(notary);
        //@todo add a registered user
      })
      // .then(() => {
      //     // add a user to the contract
      // })

  // then we want to fund the contract
  // we may also want to update system wide cars

};*/



// const fund


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