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

    function getImplementedInterfaces() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IMockDeepCallerContextLogic).interfaceId;
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function getDeepCurrentCaller() external returns(address);\n"
                "function getDeepLastExternalCaller() external returns(address);\n";
    }

    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IMockDeepCallerContextLogic.getDeepCurrentCaller.selector;
        selectors[1] = IMockDeepCallerContextLogic.getDeepLastExternalCaller.selector;
    }
}