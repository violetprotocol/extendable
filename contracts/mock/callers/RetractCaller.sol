//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./ExtendCaller.sol";

/**
 * Mock caller for retract.test.js
 * 
 * Tests RetractLogic without Extendable.sol as standalone unit
 */
contract RetractCaller is ExtendCaller {
    address internal _retractLogic;

    constructor(address permissioninglogic, address extendLogic, address retractLogic) ExtendCaller(permissioninglogic, extendLogic) {
        _retractLogic = retractLogic;
    }

    function callRetract(address extension) public {
        (bool success, ) = _retractLogic.delegatecall(abi.encodeWithSignature("retract(address)", extension));
        Revert.require(success);
    }
}