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

    function getSolidityInterface() override public pure returns(string memory) {
        return  "function callInternalFunction() external;\n"
                "function internalFunction() external;\n";
    }

    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](2);
        functions[0] = IMockInternalExtension.callInternalFunction.selector;
        functions[1] = IMockInternalExtension.internalFunction.selector;

        interfaces[0] = Interface(
            type(IMockInternalExtension).interfaceId,
            functions
        );
    }
}