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
        interfaces[0] = Interface(
            type(IMockNewReplaceLogic).interfaceId,
            abi.decode(abi.encode([
                IMockNewReplaceLogic.replace.selector,
                IMockNewReplaceLogic.replaceWith.selector
            ]), (bytes4[]))
        );
    }
}