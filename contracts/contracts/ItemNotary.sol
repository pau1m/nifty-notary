//update to 0.6.x when supporting tools are out of beta
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract Registry is Ownable, GSNRecipient {

    mapping(address => bool) registered;
    event updatedRegistry(address);

    function isRegistered(address _addr) public view returns (bool) {
        return registered[_addr];
    }

    function updateRegistry(address _addr, bool _active) public onlyOwner {
        registered[_addr] = _active;
        emit updatedRegistry(_addr);
    }
}

contract ItemNotary is Registry {

    // @todo hmmmmmm, may need to change how this works
    enum itemTypes {Invalid, Exists, Sha2, Sha3, EthereumSigned, BitcoinSigned, Passphrase, Other}

    struct Item {
        uint8 itemType;
        string url; // for ipfs means takign an extra slot by including tyoe in path or have it implied externally
    }

    mapping(bytes32 => Item) items;

    event addedItem(bytes32 itemHash);

    constructor() public {}

   function () external payable {
        revert('This wallet does not accept Eth');
    }

    function storeItem(bytes32 _itemHash, uint8 _itemType, string memory _link)
    public
    {
        //@todo consider making decorator.
        require(isRegistered(_msgSender()), "Account not registered");
        require(_itemType > 0, "Item type must be a positive number");
        require(!isItem(_itemHash), "Item already exists");

        Item memory item = Item(_itemType, _link);
        items[_itemHash] = item;
        emit addedItem(_itemHash);
    }

    function getItem(bytes32 _itemHash)
    public
    view
    returns
    (bytes32 itemHash, uint8 itemType, string memory _link)
    {
        return (_itemHash, getItemType(_itemHash), getItemLink(_itemHash));
       // return ([])?? how do we return multiple types
    }

    // consider private or internal ? is there much gas difference

    function isItem(bytes32 _itemHash)
    public
    view
    returns
    (bool)
    {
        return (items[_itemHash].itemType > 0);
    }

    function getItemType(bytes32 _itemHash)
    public
    view
    returns
    (uint8)
    {
        return items[_itemHash].itemType;
    }

    function getItemLink(bytes32 _itemHash)
    public
    view
    returns
    (string memory link)
    {
        return items[_itemHash].url;
    }

    function isCreator(bytes32 _itemHash, bytes32 _signatory)
    public
    returns
    (bool)
    {
        // @todo has proof... then can allow to do other things
        return true;
    }

    /**
     * Only applicable if use is the owner...
     */
    function tradeThisItem(/*erc721 contract address*/)
    public
    {
        // @todo
        // make tradable... add to erc721 contract
        // either item could be....
        // think about independent rolling this out
        // if the user is validated as an ethereum user
        // allow the proof of their private key to launch this
        // as an erc721 token.
    }

    function acceptRelayedCall(
    address relay,
    address from,
    bytes calldata encodedFunction,
    uint256 transactionFee,
    uint256 gasPrice,
    uint256 gasLimit,
    uint256 nonce,
    bytes calldata approvalData,
    uint256 maxPossibleCharge
    ) external view returns (uint256, bytes memory) {
        //@todo require is registered
    return _approveRelayedCall();
    }

// May use these later _preRelayedCall and _postRelayedCall empty
function _preRelayedCall(bytes memory context) internal returns (bytes32) {
}

function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32) internal {
}

}

//    function testRelay() public returns (bool)
//    {
//        emit relayWorks(1);
//        return true;
//    }





    // @todo create signing and verification, need another input
    // @todo think about how this can be extended to account for
    // @todo things like legal contracts..
    /*

sign(keccak256("\x19Ethereum Signed Message:\n" + len(message) + message)))



    function VerifyStoredSecret(bytes32 hash, bytes32 proof)
        internal
    {

    }

//    function relayStoreHashAndLink(bytes32 hash, string link) public {
//    require(isRegistered(_msgSender()), "Account not registered");
//    require(!_exists[hash], "Hash already recorded");
//    require(!_existsWithProof[hash], "Has with proof already exists");
//    // _recordCount = _recordCount + 1; // is there any point recording this
//    // @todo make past tense
//    _exists[hash] = true;
//
//    // create a new object in memory
//    emit SignedAndNotarised(hash);
//    }

    function proveSignature(bytes32 hash, bytes32 thingToProve)
    public
    constant
    {

    }


    // actually should be using



//    function recoverSigner(bytes32 message, bytes sig)
//    internal
//    pure
//    returns (address)
//    {
//        uint8 v;
//        bytes32 r;
//        bytes32 s;
//
//        (v, r, s) = splitSignature(sig);
//
//        return ecrecover(message, v, r, s);
//    }

//    function proveEthSig(){};
//    function proveBtcSig(){};
    //@todo add pluggable verification mechanism

//    function stamp(string ownerEmail, string sha) payable costs(_price) {
//        require(!isRecorded(sha));
//
//        Record memory rec = Record(ownerEmail, now);
//        _records[sha] = rec;
//        _recordCount = _recordCount + 1;
//    }

//    function isRecorded(bytes32 sha) public view returns (bool) {
//       return bytes(_records[sha].id).length != 0;
//        // or sha3(myVariable) != sha3("")
//
//        return (!emptyString(_records[sha].id));
//    }

    function emptyString(string memory item) public pure returns (bool) {
        return bytes(item).length == 0;
    }

    function getRecord(bytes32 _hash) public view returns (bytes32 hash, string memory id, uint8 idType) {
        return  (_hash, _records[_hash].id, _records[_hash].idType);
    }


    // how do we setup for dev accepting relay call...
    // on deploy transfer money to contract
    // allow for draining of contract
    // add conditons to our contract

    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external view returns (uint256, bytes memory) {

        // is from, from the relayer or the user?
        //require(isRegistered(_msgSender()), "Account not registered");
        // we have to be a bit more strict about who can use this
        // keep gas low

        return _approveRelayedCall();
    }

    // May use these later _preRelayedCall and _postRelayedCall empty
    function _preRelayedCall(bytes memory context) internal returns (bytes32) {
    }

    function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32) internal {
    }

//    function compareStrings (string memory a, string memory b) public view
//    returns (bool) {
//        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
//
//    }

//    function lookup(bytes32 sha) public view returns(bytes32, uint) {
//        Record memory rec = _records[sha];
//        return (rec.email, rec.timeStamp);
//    }

//    function ecrecovery(bytes32 hash, bytes memory sig) public view returns (address) {
//        bytes32 r;
//        bytes32 s;
//        uint8 v;
//
//        if (sig.length != 65) {
//            return address(0x0);
//        }
//
//        assembly {
//            r := mload(add(sig, 32))
//            s := mload(add(sig, 64))
//            v := and(mload(add(sig, 65)), 255)
//        }
//
//        // https://github.com/ethereum/go-ethereum/issues/2053
//        if (v < 27) {
//            v += 27;
//        }
//
//        if (v != 27 && v != 28) {
//            return address(0x0);
//        }
//
//        return ecrecover(hash, v, r, s);
//    }
//
//    function ecverify(bytes32 hash, bytes memory sig, address signer) public view returns (bool) {
//        return signer == ecrecovery(hash, sig);
//    }

//    function updatePrice(uint newPrice) public ownerOnly {
//        _price = newPrice;
//    }
}


/*

pragma solidity ^0.4.4;

import './Ownable.sol';

contract Notary is Ownable {
  mapping (bytes32 => address) public records;
  mapping (bytes32 => uint256) public timestamps;

  event LogNotarized(bytes32 indexed record, address indexed notarizer, uint256 timestamp);

  function notarize(bytes32 record) external {
    bytes32 hash = keccak256(record);
    require(hash != keccak256(""));
    require(records[hash] == address(0));
    require(timestamps[hash] == 0);
    records[hash] = msg.sender;
    timestamps[hash] = block.timestamp;

    LogNotarized(hash, msg.sender, block.timestamp);
  }

  function exists(bytes32 record) constant returns (bool) {
    bytes32 hash = keccak256(record);
    return records[hash] != address(0);
  }

  function getNotarizer(bytes32 record) constant returns (address) {
    return records[keccak256(record)];
  }

  function getTimestamp(bytes32 record) constant returns (uint256) {
    return timestamps[keccak256(record)];
  }

  function didNotarize(bytes32 record) constant returns (bool) {
    return records[keccak256(record)] == msg.sender;
  }

  function isNotarizer(bytes32 record, address notarizer) constant returns (bool) {
    return records[keccak256(record)] == notarizer;
  }

  function ecrecovery(bytes32 hash, bytes sig) public constant returns (address) {
    bytes32 r;
    bytes32 s;
    uint8 v;

    if (sig.length != 65) {
      return 0;
    }

    assembly {
      r := mload(add(sig, 32))
      s := mload(add(sig, 64))
      v := and(mload(add(sig, 65)), 255)
    }

    // https://github.com/ethereum/go-ethereum/issues/2053
    if (v < 27) {
      v += 27;
    }

    if (v != 27 && v != 28) {
      return 0;
    }

    return ecrecover(hash, v, r, s);
  }

  function ecverify(bytes32 hash, bytes sig, address signer) public constant returns (bool) {
    return signer == ecrecovery(hash, sig);
  }
}








*/
