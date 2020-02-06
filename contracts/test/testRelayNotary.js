
// try and just use oz for one set of tests...
// add to startup....

// simple one page react

// beforeEach(async function () {
//     // Create web3 instance and a contract
//     this.web3 = new Web3(PROVIDER_URL);
//     this.accounts = await this.web3.eth.getAccounts();
//
//     // Create recipient contract
//     const Recipient = new this.web3.eth.Contract(RecipientAbi, null, { data: RecipientBytecode });
//     this.recipient = await Recipient.deploy().send({ from: this.accounts[0], gas: 1e6 });
//
//     // Register the recipient in the hub
//     await fundRecipient(this.web3, { recipient: this.recipient.options.address });
//
//     // Create gsn provider and plug it into the recipient
//     const gsnProvider = new GSNProvider(PROVIDER_URL);
//     this.recipient.setProvider(gsnProvider);
// });

//const {
//     deployRelayHub,
//     runRelayer,
//     fundRecipient,
// } = require('@openzeppelin/gsn-helpers');
//
// const web3 = new Web3('http://localhost:8545');
//
// await deployRelayHub(web3);
//
// await runRelayer(web3, { quiet: true });
//
// await fundRecipient(web3, { recipient: <address>, amount: 50000000 });


// const { GSNProvider } = require("@openzeppelin/gsn-provider");
// const Web3 = require("web3");
// const web3 = new Web3(new GSNProvider("http://localhost:8545"));
//





// so it seems like it expects its own test environment setup
// workaround is to full roll with openzeppelin
// or cludge together with own web3

const { constants, expectEvent } = require('@openzeppelin/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');
const { expect } = require('chai');


// maybe should just use the stuff from openzeppelin in here
// might make things easier.. retrofit for now.. get one tx working
//const { accounts, contract } = require('@openzeppelin/test-environment');

const [ admin, deployer, alice, bob, charlie ] = accounts;
console.log(accounts);
const { ZERO_ADDRESS } = constants;




// const { accounts, contract } = require('@openzeppelin/test-environment');

// Use the different accounts, which are unlocked and funded with Ether


// Create a contract object from a compilation artifact
const Notary = contract.fromArtifact('Notary');

describe('Notary', function () {
    // const [ owner ] = accounts;
    let notary = {}

    beforeEach(async function () {
        // Deploy a new Box contract for each test
        notary = await Notary.new({ from: admin });
        //console.log(notary)

        const registeredUser = await notary.updateRegistry(alice, true, {from: admin});
        console.log(registeredUser);
    });

    // Test case
    it('Should do something', async () => {
        expect(await notary.isRegistered(alice)).to.equal(true);
        expect(await notary.isRegistered(bob)).to.equal(false);
    })

    // so!!!!!!! now we want to get this running with


    // it('retrieve returns a value previously stored', async function () {
    //     // Store a value - recall that only the owner account can do this!
    //     await this.contract.store(42, { from: owner });
    //
    //     // Test if the returned value is the same one
    //     // Note that we need to use strings to compare the 256 bit integers
    //     expect((await this.contract.retrieve()).toString()).to.equal('42');
    // });
});

// it("Should have deployed and registered user", async () => {
//     expect(await notary.isRegistered(alice)).to.equal(true);
//     expect(await notary.isRegistered(bob)).to.equal(false);
// });
//
// it("Should add a hash", async () => {
//     const notarised = await notary.notarise('foo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687', {from: alice})
//
//     expect(await notary.isRecorded('0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687')).to.equal(true);
//     // console.log(notarised);
// });

// console.log(Notary);

// console.log(Notary);



// somewhere have to set port config
// // npm install @openzeppelin/gsn-provider
// const Web3 = require("web3");
// const web3 = new Web3(new GSNProvider("http://localhost:8545"));
//



// const Notary = artifacts.require('Notary');
//
// // maybe rework this to use helpers
// // have to do something to target config properly
//
// // const myContract = new web3.eth.Contract(abi, address);
// //
// // // Sends the transaction via the GSN
// // await myContract.methods.myFunction().send({ from });
// //
// // // Disable GSN for a specific transaction
// // await myContract.methods.myFunction().send({ from, useGSN: false });
//
// // Test all postive cases for the moment
// contract("Notary", accounts => {
//     let admin = accounts[0];
//     let alice = accounts[1];
//     let bob = accounts[2];
//     notary = {};
//
//     beforeEach(async () => {
//         notary = await Notary.new();
//         const registeredUser = await notary.updateRegistry(alice, true);
//         // console.log(registeredUser);
//     });
//
//     it("Should have deployed and registered user", async () => {
//         expect(await notary.isRegistered(alice)).to.equal(true);
//         expect(await notary.isRegistered(bob)).to.equal(false);
//     });
//
//     it("Should add a hash", async () => {
//         const notarised = await notary.notarise('foo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687', {from: alice})
//
//         expect(await notary.isRecorded('0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687')).to.equal(true);
//         // console.log(notarised);
//     });
//
//     it("Should retrieve a hash", async () => {
//         await notary.notarise('foo@example.com', 0, '0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687', {from: alice})
//         const gotRecord = await notary.getRecord('0xB03D0ae6e31c5ff9259fA85642009bF4ad6b2687');
//         // console.log(gotRecord);
//     });
