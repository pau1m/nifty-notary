//0.5.16
pragma solidity ^0.5.16;

import './Owned.sol';
//import './Priced.sol';
// add a registry
// anyone can use directly if they pay
// anyone can use directly if they are registered
// add a simple registry


// could just move this right in... it's going ot be pretty simple
contract Registry is Owned {

    mapping(address => bool) registered;

    // statoc
    function isRegistered(address _addr) {
        return registered['_addr'];
    }

    // proxy owner
    function updateRegistry(bool _active) ownerOnly {
        registered[address] = _active;
    } // this should probably belong to the proxy...
}

contract DocStamp is Registry {
    struct Record {
        string email;
        uint timeStamp; // fire an event instead of a timestamp
    }

    // sha256 => Record
    mapping(string => Record) _records;
//    uint _price;
    uint _recordCount;

  //  function DocStamp(uint initialPrice) {
    function DocStamp() {
//        _price = initialPrice;
        _recordCount = 0; // is it not 0 amyway!?
    }

    // Thanks for the donation
    // make not payable reject
//    function () payable {
//    }

//    function drain() ownerOnly {
//        _owner.transfer(this.balance);
//    }

//    function getPrice() constant returns (uint price) {
//        price = _price;
//    }

    function getCount() constant ownerOnly returns (uint) {
        return _recordCount;
    }

    function stampDirect(string ownerEmail, string sha) {
        // check this will apply to proxy
        require(isRegistered(msg.sender));
        require(!isRecorded(sha));

        Record memory rec = Record(ownerEmail, now);
        _records[sha] = rec;
        _recordCount = _recordCount + 1;
    }

//    function stamp(string ownerEmail, string sha) payable costs(_price) {
//        require(!isRecorded(sha));
//
//        Record memory rec = Record(ownerEmail, now);
//        _records[sha] = rec;
//        _recordCount = _recordCount + 1;
//    }

    function isRecorded(string sha) constant returns (bool) {
        return _records[sha].timeStamp != 0;
    }

    function lookup(string sha) constant returns(string, uint) {
        Record memory rec = _records[sha];
        return (rec.email, rec.timeStamp);
    }

    // only accept incoming messages from a proxy account...
    // the proxy account exists on registrysolidity

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