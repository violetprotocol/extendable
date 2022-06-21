//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/InternalExtension.sol";

interface IMockInternalExtension {
    function callInternalFunction() external;
    function internalFunction() external;
}

contract MockInternalExtension is IMockInternalExtension, InternalExtension {
    function callInternalFunction() override public {
        IMockInternalExtension(address(this)).internalFunction();
    }

    function internalFunction() override public view _internal {
        return;
    }

    function getInterfaceIds() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IMockInternalExtension).interfaceId;
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function callInternalFunction() external;\n"
                "function internalFunction() external;\n";
    }

    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IMockInternalExtension.callInternalFunction.selector;
        selectors[1] = IMockInternalExtension.internalFunction.selector;
    }
}