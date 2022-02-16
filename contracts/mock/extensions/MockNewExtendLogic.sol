//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";

interface IMockNewExtendLogic {
    function extend(address extension) external;
    function getCurrentInterface() external view returns(string memory fullInterface);
    function getExtensions() external view returns(bytes4[] memory);
    function getExtensionAddresses() external view returns(address[] memory);
    function randomNewFunction() external;
}

contract MockNewExtendLogic is IMockNewExtendLogic, Extension {
    function extend(address extension) override public {}

    function getCurrentInterface() override public pure returns(string memory fullInterface) { return("lel"); }

    function getExtensions() override public pure returns(bytes4[] memory) { return(new bytes4[](0xffffffff)); }

    function getExtensionAddresses() override public pure returns(address[] memory) { return(new address[](0x0) ); }

    function randomNewFunction() override public {}

    function getInterface() override public pure returns(string memory) {
        return  "function extend(address extension) external;\n"
                "function getCurrentInterface() external view returns(string memory fullInterface);\n"
                "function getExtensions() external view returns(bytes4[] memory);\n"
                "function getExtensionAddresses() external view returns(address[] memory);\n"
                "function randomNewFunction() external;\n";
    }
    
    function getInterfaceId() override public pure returns(bytes4) {
        return type(IMockNewExtendLogic).interfaceId;
    }
}