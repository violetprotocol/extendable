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

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IMockInternalExtension).interfaceId);
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function callInternalFunction() external;\n"
                "function internalFunction() external;\n";
    }
}