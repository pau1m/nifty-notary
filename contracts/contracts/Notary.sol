//0.5.16
pragma solidity ^0.5.16;


//@todo either here or in separate contract... Only accept signed messages...
// That we we never have to risk what happens to the key... It does not manage any funds...
//import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
//^import owned from here


//
//import './Owned.sol';
//import './Priced.sol';
// add a registry
// anyone can use directly if they pay
// anyone can use directly if they are registered
// add a simple registry


// could just move this right in... it's going ot be pretty simple
contract Registry is Ownable {

    mapping(address => bool) registered;
    event updatedRegistry();

    // statoc
    function isRegistered(address _addr) public view returns (bool) {
        return registered[_addr];
    }

    // proxy owner
    function updateRegistry(address _addr, bool _active) public onlyOwner {
        registered[_addr] = _active;
        emit updatedRegistry();
        // do we have to copy the whole object in for this to work?
    } // this should probably belong to the proxy...
}

contract Notary is Registry {

    // not sure about this list... Should all data be kept in a separate contract
    // and this make upgradeable

    // no point in restricting it...this
    //
    // enum IDTypes { Private, IPFS, Email, ENS, EthAddress, BTCAddress, Other }
    // can just put in comments rather than enforce...
    // leave up to others..

    // 0 email
    // 1 Private
    // 2 IPFS
    // 3 Ethereum address
    // 4 Other
    // 5 ...

    // consider making bytes32 a string
    struct Record {
        bytes32 id; // this may refer to anything... local db, ipfs.... there can only be one... cannot be changed
        uint8 idType; // fire an event instead of a timestamp
    }

    // sha256 => Record
    mapping(bytes32 => Record) _records;
//    uint _price;
    uint _recordCount; // auto 0

    // do we even need this... could we just emit it as an event!!!!
    event Notarise(bytes32 hash/*, bytes32 id*/);

  //  function DocStamp(uint initialPrice) {
    constructor() public {
//        _price = initialPrice;
       // _recordCount = 0; // is it not 0 amyway!?
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

    function getCount() public view returns (uint) {
        return _recordCount;
    }

    // are string fixed in solidity now!!!??
    //function stampDirect(string ownerEmail, string sha) {
    // sign types


    // make this private
    function notarise(bytes32 _id, uint8 _idType, bytes32 hash) public {
        // check this will apply to proxy
        require(isRegistered(msg.sender));
        require(!isRecorded(hash));

        Record memory rec = Record(_id, _idType);
        _records[hash] = rec;
        _recordCount = _recordCount + 1;

        // hmmmm not sure about this duplication
        emit Notarise(hash); // hmmm, we could just put it here and avoid storing on-chain in another way..._id type /
        // could these be made tradeable
    }

//    function stamp(string ownerEmail, string sha) payable costs(_price) {
//        require(!isRecorded(sha));
//
//        Record memory rec = Record(ownerEmail, now);
//        _records[sha] = rec;
//        _recordCount = _recordCount + 1;
//    }

    function isRecorded(bytes32 sha) public view returns (bool) {
        return true;
        //@todo !!!
        //bool(_records[sha]);
    }

//    function lookup(bytes32 sha) public view returns(bytes32, uint) {
//        Record memory rec = _records[sha];
//        return (rec.email, rec.timeStamp);
//    }

    // only accept incoming messages from a proxy account...
    // the proxy account exists on registrysolidity
    // so... the contract that contains this is the one...this
    // how do we request something to sign...
    // do we need to simulate a thing to sign


    function ecrecovery(bytes32 hash, bytes memory sig) public view returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (sig.length != 65) {
            return address(0x0);
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
            return address(0x0);
        }

        return ecrecover(hash, v, r, s);
    }

    function ecverify(bytes32 hash, bytes memory sig, address signer) public view returns (bool) {
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