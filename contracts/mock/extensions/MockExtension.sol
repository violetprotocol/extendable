//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";

interface IMockExtension {
    event Test();
    function test() external;
    function reverts() external;
}

contract MockExtension is IMockExtension, Extension {
    function test() override public {
        emit Test();
    }

    function reverts() override public pure {
        revert("normal reversion");
    }
    
    function getSolidityInterface() override public pure returns(string memory) {
        return  "function test() external;\n"
                "function reverts() external;\n";
    }

    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](2);
        functions[0] = IMockExtension.test.selector;
        functions[1] = IMockExtension.reverts.selector;

        interfaces[0] = Interface(
            type(IMockExtension).interfaceId,
            functions
        );
    }
}