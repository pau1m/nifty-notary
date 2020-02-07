//update to 0.6.x when supporting tools are out of beta
pragma solidity ^0.5.16;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/GSN/GSNRecipient.sol";


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

contract Notary is Registry {
    // enum IDTypes { Private, IPFS, Email, ENS, EthAddress, BTCAddress, Other }

    // 0 email
    // 1 Private
    // 2 IPFS
    // 3 Ethereum address
    // 4 Other
    // 5 ...

    struct Record {
        string id; // this may refer to anything... local db, ipfs.... there can only be one... cannot be changed
        uint8 idType; // fire an event instead of a timestamp
    }

    mapping(bytes32 => Record) _records;

    uint _recordCount; // auto 0

    event Notarise(bytes32 hash/*, bytes32 id*/);
    event relayWorks(uint num);

  //  function DocStamp(uint initialPrice) {
    constructor() public {
//        _price = initialPrice;
       // _recordCount = 0; // is it not 0 amyway!?
    }

    // What is this supposed to be in 5.x 6.x
    // allow for loading funds for paying GSN
   function () external payable {
    }

    //@todo function withdraw
    //@todo user tokens

    function getCount() public view returns (uint) {
        return _recordCount;
    }

    // make this private
    function notarise(string memory _id, uint8 _idType, bytes32 hash) public {

        require(!emptyString(_id));
        require(hash != 0);
        require(isRegistered(msg.sender));
        require(!isRecorded(hash));

        Record memory rec = Record(_id, _idType);
        _records[hash] = rec;
        _recordCount = _recordCount + 1;

        // hmmmm not sure about this duplication
        emit Notarise(hash); // hmmm, we could just put it here and avoid storing on-chain in another way..._id type /
        // could these be made tradeable
    }



    function testRelay() public returns (bool) {
        emit relayWorks(1);
        return true;
    }

    // now we
    function relayNotarise(string memory _id, uint8 _idType, bytes32 hash) public {
        require(!emptyString(_id));
        require(hash != 0);
        require(isRegistered(_msgSender()));
        require(!isRecorded(hash));

        Record memory rec = Record(_id, _idType);
        _records[hash] = rec;
        _recordCount = _recordCount + 1;

        emit Notarise(hash);
    }

//    function stamp(string ownerEmail, string sha) payable costs(_price) {
//        require(!isRecorded(sha));
//
//        Record memory rec = Record(ownerEmail, now);
//        _records[sha] = rec;
//        _recordCount = _recordCount + 1;
//    }

    function isRecorded(bytes32 sha) public view returns (bool) {
       return bytes(_records[sha].id).length != 0;
        // or sha3(myVariable) != sha3("")

        return (!emptyString(_records[sha].id));
    }

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