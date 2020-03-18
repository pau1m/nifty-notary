module.exports = {
  'invalid': '0', // If no value provided or set to 0 request will be rejected
  'exists': '1', // anonymous type
  'sha256': '2',
  'sha3-256': '3', // sha3-256
  'ethSig': '4', // sha3 eth signature (cast to bytes32)
  'sha3PlusEthSig': '5', // store sha3 file hash as well as signature
  'passphrase': '6', // an arbitary text string
  'other': '7' // 7 and above defined independently by the user of the service
};
