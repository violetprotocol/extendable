//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../errors/Errors.sol";
import "../../extensions/permissioning/PermissioningLogic.sol";
import "./Revert.sol";

/**
 * Mock caller for permissioning.test.js
 * 
 * Tests PermissioningLogic without Extendable.sol as standalone unit
 */
contract PermissioningCaller {
    address internal _permissioningLogic;

    constructor(address permissioningLogic) {
        _permissioningLogic = permissioningLogic;
    }

    function init() public {
        (bool success, ) = _permissioningLogic.delegatecall(abi.encodeWithSignature("init()"));
        Revert.require(success);
    }

    function getOwner() public returns(address owner) {
        (bool success, bytes memory result) = _permissioningLogic.delegatecall(abi.encodeWithSignature("getOwner()"));
        Revert.require(success);
        owner = abi.decode(result, (address));
        return(owner);
    }

    function updateOwner(address newOwner) public {
        (bool success, ) = _permissioningLogic.delegatecall(abi.encodeWithSignature("updateOwner(address)", newOwner));
        Revert.require(success);
    }

    function renounceOwnership() public {
        (bool success, ) = _permissioningLogic.delegatecall(abi.encodeWithSignature("renounceOwnership()"));
        Revert.require(success);
    }
}