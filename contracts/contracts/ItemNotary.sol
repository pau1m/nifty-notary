pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "./ECDSA.sol";

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

    using ECDSA for bytes32;

    enum ItemTypes {Invalid, Exists, Sha256, Sha3, EthSig, Sha3PlusEthSig, Passphrase, Other}

    struct Item {
        uint8 itemType; //
        string url; // optional
        // Only if on-chain proof required
        bytes signature; // optional
    }

    mapping(bytes32 => Item) items;

    event addedItem(bytes32 itemHash);
    event testSomething(address foo);

    constructor() public {}

    function()
    external
    payable
    {
        revert('This wallet does not accept Eth');
    }

    function storeItem(bytes32 _itemHash, uint8 _itemType, string memory _link, bytes memory _signature)
    public
    {
        require(isRegistered(_msgSender()), "Account not registered");
        require(_itemType > 0, "Item type must be a positive number");
        require(!isItem(_itemHash), "Item already exists");

        Item memory item = Item(_itemType, _link, _signature);
        items[_itemHash] = item;
        emit addedItem(_itemHash);
    }

    function getItem(bytes32 _itemHash)
    public
    view
    returns
    (bytes32 itemHash, uint8 itemType, string memory link, bytes memory signature)
    {
        return (_itemHash, getItemType(_itemHash), getItemLink(_itemHash), getItemSig(_itemHash));
    }

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

    function getItemSig(bytes32 _itemHash)
    public
    view
    returns
    (bytes memory)
    {
        return items[_itemHash].signature;
    }

    /**
     * Only applicable if use is the owner...
     */
//    function tradeThisItem(bytes32 _itemHash)
//    public
//    {
//        require(isRegistered(_msgSender()));
//        //require(proof of ownership)
//        // transfer
//    }

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
    )
    external
    view
    returns
    (uint256, bytes memory)
    {
        require(isRegistered(from));

//        require(isRegistered(_msgSender()));
        // require gas
        // transaction fee
        // max possible charge
        return _approveRelayedCall();
    }


    function _preRelayedCall(bytes memory context)
    internal
    returns
    (bytes32)
    {
        // not implemented
    }

    function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32)
    internal
    {
        // @todo actual charge
    }

    function senderIsSigner(bytes32 _itemHash)
    public
    view
    returns
    (bool)
    {
        return (addressIsOwner(_msgSender(), _itemHash));
    }

    function addressIsSigner(address _address, bytes32 _itemHash)
    public
    view
    returns
    (bool)
    {
        require(ItemTypes(items[_itemHash].itemType) == ItemTypes.Sha3PlusEthSig, "Items is not of type EthHashPlusSig");
        require(items[_itemHash].signature.length > 0, "No signature provided"); // @note length returns true in 0.6

        bytes32 prefixedHash = _itemHash.toEthSignedMessageHash();
        return _address == prefixedHash.recover(items[_itemHash].signature);
    }
}

