//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";
import { IMockCallerContextLogic } from "./MockCallerContextLogic.sol";

interface IMockDeepCallerContextLogic {
    function getDeepCallerStack() external returns(address[] memory);
    function getDeepCurrentCaller() external returns(address);
    function getDeepLastExternalCaller() external returns(address);
}

contract MockDeepCallerContextLogic is IMockDeepCallerContextLogic, Extension {
    function getDeepCallerStack() override public returns(address[] memory) {
        return IMockCallerContextLogic(address(this)).getCallerStack();
    }

    function getDeepCurrentCaller() override public returns(address) {
        return IMockCallerContextLogic(address(this)).getCurrentCaller();
    }

    function getDeepLastExternalCaller() override public returns(address) {
        return IMockCallerContextLogic(address(this)).getLastExternalCaller();
    }
    
    function getSolidityInterface() override public pure returns(string memory) {
        return  "function getDeepCurrentCaller() external returns(address);\n"
                "function getDeepLastExternalCaller() external returns(address);\n";
    }

    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);
        
        bytes4[] memory functions = new bytes4[](2);
        functions[0] = IMockDeepCallerContextLogic.getDeepCurrentCaller.selector;
        functions[1] = IMockDeepCallerContextLogic.getDeepLastExternalCaller.selector;

        interfaces[0] = Interface(
            type(IMockDeepCallerContextLogic).interfaceId,
            functions
        );
    }
}