//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../errors/Errors.sol";
import "../../extensions/permissioning/PermissioningLogic.sol";
import "./Revert.sol";

/**
 * Mock caller for extend.test.js
 * 
 * Tests ExtendLogic without Extendable.sol as standalone unit
 */
contract ExtendCaller {
    address internal _extendLogic;

    constructor(address permissioninglogic, address extendLogic) {
        (bool success, ) = permissioninglogic.delegatecall(abi.encodeWithSignature("init()"));
        Revert.require(success);
        _extendLogic = extendLogic;
    }

    function getOwner(address permissioninglogic) public returns(address owner) {
        (bool success, bytes memory result) = permissioninglogic.delegatecall(abi.encodeWithSignature("getOwner()"));
        Revert.require(success);
        owner = abi.decode(result, (address));
        return(owner);
    }

    function callExtend(address extension) public {
        (bool success, ) = _extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", extension));
        Revert.require(success);
    }

    function getCurrentInterface() public returns(string memory) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("getCurrentInterface()"));
        Revert.require(success);
        string memory interfaceString = abi.decode(result, (string));
        return(interfaceString);
    }

    function getExtensions() public returns(bytes4[] memory) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("getExtensions()"));
        Revert.require(success);
        bytes4[] memory extensions = abi.decode(result, (bytes4[]));
        return(extensions);
    }

    function getExtensionAddresses() public returns(address[] memory) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("getExtensionAddresses()"));
        Revert.require(success);
        address[] memory extensions = abi.decode(result, (address[]));
        return(extensions);
    }
}