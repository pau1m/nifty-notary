// we want to export web3 object here and also wrap a contract when requires
const config = require('../config/env.config');
const Web3 = require('web3');
const web3 = new Web3(config.nodeEndPoint);
const { GSNProvider } = require("@openzeppelin/gsn-provider");
const signerAccount = web3.eth.accounts.wallet.add(config.signKey);

const txState = {
  sending: 'sending', // just getting things going, not yet submitted
  pending: 'pending', // submitted onchain
  success: 'success',
  failed: 'failed',
  confirming: 'confirming', // mined but waiting a few blocks before confirming
  rejected: 'rejected',
  fail: 'fail'
};

const getWeb3 = () => {
  return web3;
};

const getSignerAccount = () => {
  return signerAccount;
};

// @todo abstract this so not tied to one contract
const getWeb3NotaryContract = () => {
  const notaryArtifacts = require('../../../contracts/build/contracts/Notary');
  const contractAddress = config.notaryContract; //notaryArtifacts.networks[networkId].address;
  const notaryContract = new web3.eth.Contract(notaryArtifacts.abi, contractAddress);

  return notaryContract;
};

const addGSNProcviderToContract = (web3Contract) => {
  const gsnProvider = new GSNProvider(config.nodeEndPoint, {
    signKey: getSignerAccount()  // we also need the address of hub here, no?
  });
  web3Contract.setProvider(gsnProvider);

  return web3Contract;
};

// requires account to be unlocked
const fundRelayHub = async (from, recipient, amount = '0.1') => {

  const RelayHub =   require('../../../contracts/build/contracts/IRelayHub')
  const relayHub = new web3.eth.Contract(RelayHub.abi, '0xD216153c06E857cD7f72665E0aF1d7D82172F494'/*config.relayHub*/);
  await relayHub.methods.depositFor(config.notaryContract).send({
    from: from,
    value: web3.utils.toWei(amount, 'ether')
  });
};



