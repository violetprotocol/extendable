//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../errors/Errors.sol";
import "./PermissioningCaller.sol";
import "./Revert.sol";

/**
 * Mock caller for extend.test.js
 * 
 * Tests ExtendLogic without Extendable.sol as standalone unit
 */
contract ExtendCaller is PermissioningCaller {
    address internal _extendLogic;

    constructor(address permissioningLogic, address extendLogic) PermissioningCaller(permissioningLogic) {
        _extendLogic = extendLogic;
    }

    function callExtend(address extension) public {
        (bool success, ) = _extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", extension));
        Revert.require(success);
    }

    function getFullInterface() public returns(string memory) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("getFullInterface()"));
        Revert.require(success);
        string memory interfaceString = abi.decode(result, (string));
        return(interfaceString);
    }

    function getExtensionsInterfaceIds() public returns(bytes4[] memory) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("getExtensionsInterfaceIds()"));
        Revert.require(success);
        bytes4[] memory extensions = abi.decode(result, (bytes4[]));
        return(extensions);
    }

    function getExtensionsFunctionSelectors() public returns(bytes4[] memory) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("getExtensionsFunctionSelectors()"));
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

    function registerInterface(bytes4 iface) public {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("registerInterface(bytes4)", iface));
        Revert.require(success);
    }

    function supportsInterface(bytes4 iface) public returns(bool) {
        (bool success, bytes memory result) = _extendLogic.delegatecall(abi.encodeWithSignature("supportsInterface(bytes4)", iface));
        Revert.require(success);
        bool supported = abi.decode(result, (bool));
        return(supported);
    }
}