
/**
 * Only intended to test against local test node. Not for live.
 */

// const ethSigUtil = require('eth-sig-util');
const crypto = require('crypto');

const makeId = length => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateHash = (data = null, hashType = 'sha3-256') => {
  data = (data === null) ? makeId(1000) : data;
  return '0x' + crypto.createHash(hashType).update(data).digest('hex');
};

const { constants, expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { expect } = require('chai');
const config = require('../config');

const ItemNotary = artifacts.require('ItemNotary');
const RelayHub = artifacts.require('IRelayHub');

const { GSNProvider } = require("@openzeppelin/gsn-provider");


// Using GSN example
// const myContract = new web3.eth.Contract(abi, address);
//
// // Sends the transaction via the GSN
// await myContract.methods.myFunction().send({ from });
//
// // Disable GSN for a specific transaction
// await myContract.methods.myFunction().send({ from, useGSN: false });

// Test only happy path in this revision
contract("Notary", accounts => {
  const [ admin, relayer, alice, bob, charlie ] = accounts;

  let itemNotary = {};
  let notaryGSM = {};

  before(async () => {});


  beforeEach(async () => {

    itemNotary = await ItemNotary.new();
    notaryGSM = new web3.eth.Contract(itemNotary.abi, itemNotary.address);

    const relayHub = await new web3.eth.Contract(RelayHub.abi, config.relayHub);
    const funded = await relayHub.methods.depositFor(itemNotary.address).send({from: accounts[0], value: web3.utils.toWei('0.3', 'ether')});

    notaryGSM.setProvider(new GSNProvider('http://localhost:8545'));
  });

  it("Should have deployed and registered user", async () => {
    const registeredUser = await itemNotary.updateRegistry(alice, true);
    expect(await itemNotary.isRegistered(alice)).to.equal(true);
    expect(await itemNotary.isRegistered(bob)).to.equal(false);
    // check for firing of events
  });

  it("Should send item from registered user via GSN", async () => {
    await itemNotary.updateRegistry(alice, true);
    const itemHash = generateHash();
    const storedItem = await notaryGSM.methods.storeItem(itemHash, 1, '', '0x0').send({from: alice, gas: 200000});

    expect(storedItem.events.addedItem.returnValues.itemHash).to.equal(itemHash);
  });


  //@todo handle malformed data
  it("Should add item-hash to contract", async () => {
    await itemNotary.updateRegistry(alice, true);
    const itemHash = generateHash();

    const storedItem = await itemNotary.storeItem(itemHash, 1, '', '0x0', {from: alice});

    expect(storedItem.logs[0].args.itemHash).to.equal(itemHash);
    expect(await itemNotary.isItem(itemHash)).to.equal(true);
    expect(await itemNotary.isItem(generateHash())).to.equal(false);
  });

  it("Should store and verify item with signature", async () => {
    await itemNotary.updateRegistry(admin, true);
    const itemHash = generateHash();

    const sig = await web3.eth.sign(itemHash, admin);
    console.log('sig', sig);
    console.log('itemHash', itemHash);
    console.log('admnin', admin);
    const signer = await web3.eth.accounts.recover(itemHash, sig, false);

    const storedItem = await itemNotary.storeItem(itemHash, '5', '', sig, {from: admin});

    expect(await itemNotary.getItemSig(itemHash)).to.equal(sig);
    expect(await itemNotary.addressIsSigner(admin, itemHash)).to.equal(true);
    expect(await itemNotary.senderIsSigner(itemHash, {from: admin})).to.equal(true);

  });

  it("Should store with a link", async () => {
    await itemNotary.updateRegistry(alice, true);
    const itemHash = generateHash();
    const link = makeId(60);
    const storedItem = await itemNotary.storeItem(itemHash, '2', link, '0x0', {from: alice});

    expect(await itemNotary.getItemLink(itemHash)).to.equal(link);
  })

  // it should not accept some functions without being in registry
  // it should be as above but with GSN too
  // ? how should we handle getters
  //@todo test all getters
});