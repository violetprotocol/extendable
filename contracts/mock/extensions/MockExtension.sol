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
    
    function getSolidityInterface() override virtual public pure returns(string memory) {
        return  "function test() external;\n"
                "function reverts() external;\n";
    }

    function getInterface() override virtual public pure returns(Interface[] memory interfaces) {
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

interface IMockSecondExtension {
    function second() external;
}

contract MockSecondExtension is IMockSecondExtension, MockExtension {
    function second() override public {
        emit Test();
    }
    
    function getSolidityInterface() override public pure returns(string memory) {
        return string(abi.encodePacked(
            MockExtension.getSolidityInterface(),
            "function second() external;\n"
        ));
    }

    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](2);

        bytes4[] memory functions = new bytes4[](1);
        functions[0] = IMockSecondExtension.second.selector;

        interfaces[0] = MockExtension.getInterface()[0];
        interfaces[1] = Interface(
            type(IMockSecondExtension).interfaceId,
            functions
        );
    }
}