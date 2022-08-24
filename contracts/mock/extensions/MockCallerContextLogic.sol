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
    
    function getSolidityInterface() override public pure returns(string memory) {
        return  "function getCallerStack() external returns(address[] memory);\n"
                "function getCurrentCaller() external returns(address);\n"
                "function getLastExternalCaller() external returns(address);\n";
    }

    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);
        
        bytes4[] memory functions = new bytes4[](3);
        functions[0] = IMockCallerContextLogic.getCallerStack.selector;
        functions[1] = IMockCallerContextLogic.getCurrentCaller.selector;
        functions[2] = IMockCallerContextLogic.getLastExternalCaller.selector;

        interfaces[0] = Interface(
            type(IMockCallerContextLogic).interfaceId,
            functions
        );
    }
}