//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";
import "../../extensions/extend/IExtendLogic.sol";

interface IMockNewFunction {
    function randomNewFunction() external;
}

contract MockNewExtendLogic is IMockNewFunction, IExtendLogic, Extension {
    function extend(address extension) override public {}

    function getCurrentInterface() override public pure returns(string memory fullInterface) { return("lel"); }

    function getExtensionsInterfaceIds() override public pure returns(bytes4[] memory) { return(new bytes4[](0xffffffff)); }

    function getExtensionsFunctionSelectors() override public pure returns(bytes4[] memory) { return(new bytes4[](0xffffffff)); }

    function getExtensionAddresses() override public pure returns(address[] memory) { return(new address[](0x0) ); }

    function randomNewFunction() override public {}

    function getSolidityInterface() override public pure returns(string memory) {
        return  "function extend(address extension) external;\n"
                "function getCurrentInterface() external view returns(string memory);\n"
                "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n"
                "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n"
                "function getExtensionAddresses() external view returns(address[] memory);\n"
                "function randomNewFunction() external;\n";
    }
    
    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](2);
        interfaces[0] = Interface(
            type(IExtendLogic).interfaceId,
            abi.decode(abi.encode([
                IExtendLogic.extend.selector,
                IExtendLogic.getCurrentInterface.selector,
                IExtendLogic.getExtensionsInterfaceIds.selector,
                IExtendLogic.getExtensionsFunctionSelectors.selector,
                IExtendLogic.getExtensionAddresses.selector
            ]), (bytes4[]))
        );
        interfaces[1] = Interface(
            type(IMockNewFunction).interfaceId,
            abi.decode(abi.encode([
                IMockNewFunction.randomNewFunction.selector
            ]), (bytes4[]))
        );
    }
}