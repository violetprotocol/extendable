//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../errors/Errors.sol";
import "../../extensions/permissioning/PermissioningLogic.sol";
import "./Revert.sol";

/**
 * Mock caller for Permissioning.test.js
 *
 * Tests PermissioningLogic without Extendable.sol as standalone unit
 */
contract PermissioningCaller {
    address internal _permissioninglogic;

    constructor(address permissioninglogic) {
        _permissioninglogic = permissioninglogic;
    }

    function getOwner() public returns (address owner) {
        (bool success, bytes memory result) = _permissioninglogic.delegatecall(abi.encodeWithSignature("getOwner()"));
        Revert.require(success);
        owner = abi.decode(result, (address));
        return (owner);
    }

    function init() public {
        (bool success, ) = _permissioninglogic.delegatecall(abi.encodeWithSignature("init()"));
        Revert.require(success);
    }

    function updateOwner(address newOwner) public {
        (bool success, ) = _permissioninglogic.delegatecall(abi.encodeWithSignature("updateOwner(address)", newOwner));
        Revert.require(success);
    }
}
