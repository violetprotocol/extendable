//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";

interface IMockNewReplaceLogic {
    function replace(address oldExtension, address newExtension) external;
    function replaceWith(address oldExtension, address newExtension) external;
}

contract MockNewReplaceLogic is IMockNewReplaceLogic, Extension {
    function replace(address oldExtension, address newExtension) override public {}
    function replaceWith(address oldExtension, address newExtension) override public {}
    function getSolidityInterface() override public pure returns(string memory) {
        return  "function replace(address oldExtension, address newExtension) external;\n"
                "function replaceWith(address oldExtension, address newExtension) external;\n";
    }
    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](2);
        functions[0] = IMockNewReplaceLogic.replace.selector;
        functions[1] = IMockNewReplaceLogic.replaceWith.selector;
        interfaces[0] = Interface(
            type(IMockNewReplaceLogic).interfaceId,
            functions
        );
    }
}