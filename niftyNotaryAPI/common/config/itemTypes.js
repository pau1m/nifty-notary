module.exports = {
  Invalid: '0', // If no value provided or set to 0 request will be rejected
  Exists: '1', // anonymous type
  Sha256: '2',
  Sha3: '3', // sha3-256
  EthSig: '4', // sha3 eth signature (cast to bytes32)
  Sha3PlusEthSig: '5', // store sha3 file hash as well as signature
  Passphrase: '6', // an arbitary text string
  Other: '7' // 7 and above defined independently by the user of the service
};
