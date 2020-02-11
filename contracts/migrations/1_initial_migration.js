const Migrations = artifacts.require("Migrations");
const Notary = artifacts.require("Notary");
const { fundRecipient } = require('@openzeppelin/gsn-helpers');
//assume web3 initialised further upstream
//const web3 = require(web3);
//@todo setup environment vars
// this mechanism is only for dev... add others later
// store and pass down values whilst moving thrugh thsi

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Notary)
      .then((notary) => {
         // console.log('wtf!!!!!', notary);
        fundRecipient(web3, { recipient: notary.address, amount: web3.utils.toWei('0.5', 'ether') });
        notary.updateRegistry(web3.eth.accounts[0], true);
        notary.updateRegistry(web3.eth.accounts[1], true);
        notary.updateRegistry(web3.eth.accounts[2], true).then((foo) => {
          //  console.log('foo', foo);
        })
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