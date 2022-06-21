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
    function getInterface() override public pure returns(string memory) {
        return  "function replace(address oldExtension, address newExtension) external;\n"
                "function replaceWith(address oldExtension, address newExtension) external;\n";
    }
    function getInterfaceIds() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IMockNewReplaceLogic).interfaceId;
    }

    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IMockNewReplaceLogic.replace.selector;
        selectors[1] = IMockNewReplaceLogic.replaceWith.selector;
    }
}