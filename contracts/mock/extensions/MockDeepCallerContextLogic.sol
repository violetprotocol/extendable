//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";
import "../../utils/CallerContext.sol";
import { IMockCallerContextLogic } from "./MockCallerContextLogic.sol";

interface IMockDeepCallerContextLogic {
    function getDeepCurrentCaller() external returns(address);
    function getDeepLastExternalCaller() external returns(address);
}

contract MockDeepCallerContextLogic is IMockDeepCallerContextLogic, Extension, CallerContext {
    function getDeepCurrentCaller() override public returns(address) {
        return IMockCallerContextLogic(address(this)).getCurrentCaller();
    }

    function getDeepLastExternalCaller() override public returns(address) {
        return IMockCallerContextLogic(address(this)).getLastExternalCaller();
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IMockDeepCallerContextLogic).interfaceId);
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function getDeepCurrentCaller() external returns(address);\n"
                "function getDeepLastExternalCaller() external returns(address);\n";
    }
}