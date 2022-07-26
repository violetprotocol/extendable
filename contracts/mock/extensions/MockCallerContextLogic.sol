//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";

interface IMockCallerContextLogic {
    function getCallerStack() external returns(address[] memory);
    function getCurrentCaller() external returns(address);
    function getLastExternalCaller() external returns(address);
}

contract MockCallerContextLogic is IMockCallerContextLogic, Extension {
    function getCallerStack() override public view returns(address[] memory) {
        CallerState storage state = CallerContextStorage._getState();
        return state.callerStack;
    }

    function getCurrentCaller() override public view returns(address) {
        return _lastCaller();
    }
    
    function getLastExternalCaller() override public view returns(address) {
        return _lastExternalCaller();
    }

    function getImplementedInterfaces() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IMockCallerContextLogic).interfaceId;
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function getCurrentCaller() external returns(address);\n"
                "function getLastExternalCaller() external returns(address);\n";
    }
    
    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IMockCallerContextLogic.getCurrentCaller.selector;
        selectors[0] = IMockCallerContextLogic.getLastExternalCaller.selector;
    }
}