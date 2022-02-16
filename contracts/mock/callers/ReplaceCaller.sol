//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./RetractCaller.sol";

/**
 * Mock caller for replace.test.js
 * 
 * Tests ReplaceLogic and StrictReplaceLogic without Extendable.sol
 * as standalone units
 */
contract ReplaceCaller is RetractCaller {
    address internal _replaceLogic;
    constructor(address permissioninglogic, address extendLogic, address retractLogic, address replaceLogic) RetractCaller(permissioninglogic, extendLogic, retractLogic) {
        _replaceLogic = replaceLogic;
    }

    function callReplace(address oldExtension, address newExtension) public {
        (bool success, ) = _replaceLogic.delegatecall(abi.encodeWithSignature("replace(address,address)", oldExtension, newExtension));
        Revert.require(success);
        // If any address is 0x0, it has been retracted in a previous step and has already been replaced
        if (_replaceLogic == address(0x0)) _setReplaceLogicAddress(newExtension);
        if (_retractLogic == address(0x0)) _setRetractLogicAddress(newExtension);
        if (_extendLogic == address(0x0)) _setExtendLogicAddress(newExtension);
    }

    function _setReplaceLogicAddress(address replaceLogic) internal {
        _replaceLogic = replaceLogic;
    }

    function _setRetractLogicAddress(address retractLogic) internal {
        _retractLogic = retractLogic;
    }

    function _setExtendLogicAddress(address extendLogic) internal {
        _extendLogic = extendLogic;
    }

    // These are called by the delegatee back to self and simulates the respective extension logic
    
    function extend(address extension) public {
        if (_extendLogic == address(0x0)) revert ExtensionNotImplemented();
        callExtend(extension);
    }

    function retract(address extension) public {
        if (_retractLogic == address(0x0)) revert ExtensionNotImplemented();
        callRetract(extension);
        if (extension == _replaceLogic) _setReplaceLogicAddress(address(0x0));
        if (extension == _retractLogic) _setRetractLogicAddress(address(0x0));
        if (extension == _extendLogic) _setExtendLogicAddress(address(0x0));
    }
}