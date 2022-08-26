//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";
import "../../extensions/extend/IExtendLogic.sol";

interface IMockNewFunction {
    function randomNewFunction() external;
}

contract MockNewExtendLogic is IMockNewFunction, IExtendLogic, Extension {
    function extend(address extension) override public {}

    function getFullInterface() override public pure returns(string memory fullInterface) { return("lel"); }

    function getExtensionsInterfaceIds() override public pure returns(bytes4[] memory) { return(new bytes4[](0xffffffff)); }

    function getExtensionsFunctionSelectors() override public pure returns(bytes4[] memory) { return(new bytes4[](0xffffffff)); }

    function getExtensionAddresses() override public pure returns(address[] memory) { return(new address[](0x0) ); }

    function randomNewFunction() override public {}

    function getSolidityInterface() override public pure returns(string memory) {
        return  "function extend(address extension) external;\n"
                "function getFullInterface() external view returns(string memory);\n"
                "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n"
                "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n"
                "function getExtensionAddresses() external view returns(address[] memory);\n"
                "function randomNewFunction() external;\n";
    }
    
    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](2);

        bytes4[] memory IExtendFunctions = new bytes4[](5);
        IExtendFunctions[0] = IExtendLogic.extend.selector;
        IExtendFunctions[1] = IExtendLogic.getFullInterface.selector;
        IExtendFunctions[2] = IExtendLogic.getExtensionsInterfaceIds.selector;
        IExtendFunctions[3] = IExtendLogic.getExtensionsFunctionSelectors.selector;
        IExtendFunctions[4] = IExtendLogic.getExtensionAddresses.selector;
        interfaces[0] = Interface(
            type(IExtendLogic).interfaceId,
            IExtendFunctions
        );

        bytes4[] memory IMockNewFunctionFunctions = new bytes4[](1);
        IMockNewFunctionFunctions[0] = IMockNewFunction.randomNewFunction.selector;
        interfaces[1] = Interface(
            type(IMockNewFunction).interfaceId,
            IMockNewFunctionFunctions
        );
    }
}

interface IMockAlternative {
    function extend(address extension) external;
    function randomNewFunction() external;
}

contract MockAlternative is IMockAlternative, Extension {
    function extend(address extension) override public {}

    function randomNewFunction() override public {}

    function getSolidityInterface() override public pure returns(string memory) {
        return  "function extend(address extension) external;\n"
                "function randomNewFunction() external;\n";
    }
    
    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](2);
        functions[0] = IMockAlternative.extend.selector;
        functions[1] = IMockAlternative.randomNewFunction.selector;
        interfaces[0] = Interface(
            type(IMockAlternative).interfaceId,
            functions
        );
    }
}