
//const { GSNProvider } = require("@openzeppelin/gsn-provider");
// maybe should just use the stuff from openzeppelin in here
// might make things easier.. retrofit for now.. get one tx working
//const { accounts, contract } = require('@openzeppelin/test-environment');



const {
    deployRelayHub,
    runRelayer,
    fundRecipient,
} = require('@openzeppelin/gsn-helpers');
const { constants, expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { expect } = require('chai');

// npm install @openzeppelin/gsn-provider
// const Web3 = require("web3");
// const web3 = new Web3(new GSNProvider("http://localhost:8545"));

const Notary = artifacts.require('Notary');



// const { GSNDevProvider } = require("@openzeppelin/gsn-provider");
const { GSNProvider } = require("@openzeppelin/gsn-provider");

// maybe rework this to use helpers
// have to do something to target config properly

// const myContract = new web3.eth.Contract(abi, address);
//
// // Sends the transaction via the GSN
// await myContract.methods.myFunction().send({ from });
//
// // Disable GSN for a specific transaction
// await myContract.methods.myFunction().send({ from, useGSN: false });

// Test all postive cases for the moment
contract("Notary", accounts => {
    const [ admin, relayer, alice, bob, charlie ] = accounts;
    notary = {};
    notaryGSM = {};

    console.log(accounts);
    // should we not be giving the address of the actuall provider -- does this go ahead and set it
    // up for us in the background... I should look in to creating an actual node
    // that does actual relaying
    // const gsnDevProvider = new GSNProvider("http://localhost:8545", {
    //     ownerAddress: admin,
    //     relayerAddress: '0xD216153c06E857cD7f72665E0aF1d7D82172F494'//relayer
    // });



    // we can't do this before each!!!!!!!!
    before(async () => {
        // await deployRelayHub(web3);
        // await runRelayer(web3, { quiet: true });
    });


    beforeEach(async () => {

        notary = await Notary.new();
        notaryGSM = new web3.eth.Contract(notary.abi, notary.address);

        console.log('NOTARY: ', notaryGSM.address);
       // console.log(notaryGSM.abi)
       // await web3.eth.sendTransaction({from: admin, to: notary.address, value: web3.utils.toWei('1', 'ether')})
        notaryGSM.setProvider(new GSNProvider('http://localhost:8545'));
        await fundRecipient(web3, { recipient: notary.address, amount: web3.utils.toWei('0.5', 'ether') });

        //web3.eth.sendTransaction({from: admin, to: notaryGSM.address, value: web3.utils.toWei('1', 'ether')})

      //
       // console.log(registeredUser);
        const registeredUser = await notary.updateRegistry(alice, true);
    });

    // can jjs

    it("MetaTx: Should call contract via gsn network", async () => {
        // const foo = await notaryGSM.methods.updateRegistry(alice, true ).send({ from: admin });
        const foo = await notaryGSM.methods.testRelay().send({ from: admin, gas: 4000000 });
        const boo = await notaryGSM.methods.relayNotarise('boo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687').send({from: alice, gas: 4000000});
        console.log('metaBoo', boo);


        // const registeredUser = await notary.updateRegistry(alice, true);
        // expect(await notary.isRegistered(alice)).to.equal(true);
        // now we want to add for



        //   console.log('foo', foo);

    });

    it("Should have deployed and registered user", async () => {
        const registeredUser = await notary.updateRegistry(alice, true);
        expect(await notary.isRegistered(alice)).to.equal(true);
        expect(await notary.isRegistered(bob)).to.equal(false);
    });

    it("Should add a hash", async () => {
        const notarised = await notary.notarise('foo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687', {from: alice})

        expect(await notary.isRecorded('0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687')).to.equal(true);
        // console.log(notarised);
    });

    it("Should retrieve a hash", async () => {
        await notary.notarise('foo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687', {from: alice})
        const gotRecord = await notary.getRecord('0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687');
        // console.log(gotRecord);
    });
});


    //     Notary.deployed()
    //         .then(balance => {
    //             assert.equal(
    //                 true,
    //                 true,
    //                 "10000 wasn't in the first account"
    //             );
    //         }))
    //  });
    //
    //
    // before
    //
    // it("Should deploy", account => {
    //
    // });

    // it("should call a function that depends on a linked library", () => {
    //     let meta;
    //     let metaCoinBalance;
    //     let metaCoinEthBalance;
    //
    //     return MetaCoin.deployed()
    //         .then(instance => {
    //             meta = instance;
    //             return meta.getBalance.call(accounts[0]);
    //         })
    //         .then(outCoinBalance => {
    //             metaCoinBalance = outCoinBalance.toNumber();
    //             return meta.getBalanceInEth.call(accounts[0]);
    //         })
    //         .then(outCoinBalanceEth => {
    //             metaCoinEthBalance = outCoinBalanceEth.toNumber();
    //         })
    //         .then(() => {
    //             assert.equal(
    //                 metaCoinEthBalance,
    //                 2 * metaCoinBalance,
    //                 "Library function returned unexpected function, linkage may be broken"
    //             );
    //         });
    // });





// describe('Notary', function () {
//     const [ creator ] = accounts;
//
//     beforeEach(async function () {
//         this.token = await SimpleToken.new({ from: creator });
//     });
//
//     it('has a name', async function () {
//         expect(await this.token.name()).to.equal('SimpleToken');
//     });
//
//     it('has a symbol', async function () {
//         expect(await this.token.symbol()).to.equal('SIM');
//     });
//
//     it('has 18 decimals', async function () {
//         expect(await this.token.decimals()).to.be.bignumber.equal('18');
//     });
