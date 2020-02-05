
//const { accounts, contract } = require('@openzeppelin/test-environment');

const { constants, expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { expect } = require('chai');
const Notary = artifacts.require('Notary');

// Test all postive cases for the moment
contract("Notary", accounts => {
    let admin = accounts[0];
    let alice = accounts[1];
    let bob = accounts[2];
    notary = {};

    beforeEach(async () => {
        notary = await Notary.new();
        const registeredUser = await notary.updateRegistry(alice, true);
       // console.log(registeredUser);
    });

    it("Should have deployed and registered user", async () => {
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








});// it("It should have deployed", () =>
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
