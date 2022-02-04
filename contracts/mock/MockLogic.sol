//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../extensions/Extension.sol";

interface IMockLogic {event Test();function test() external;function reverts() external;}
contract MockLogic is IMockLogic, Extension {
    function test() override public {
        emit Test();
    }

    function reverts() override public pure {
        revert("normal reversion");
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IMockLogic).interfaceId);
    }
    
    function getInterface() override public pure returns(string memory) {
        return "function test() external; function reverts() external;";
    }
}

interface IMockLogic2 {event Test();function second() external;}
contract MockLogic2 is IMockLogic2, Extension {
    function second() override public {
        emit Test();
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IMockLogic2).interfaceId);
    }
    
    function getInterface() override public pure returns(string memory) {
        return "function tsecondest() external;";
    }
}

// Create a mismatched interface for the MockLogic
interface IFakeLogic {
    function test() external;
    function fake() external;
    function reverts() external;
    function second() external;
}

// Create a caller that uses the mismatched interface that should fail on fake calls
contract MockLogicCaller {
    function callTest(address logicAddress) public {
        IFakeLogic logic = IFakeLogic(logicAddress);
        logic.test();
    }

    function callFake(address logicAddress) public {
        IFakeLogic logic = IFakeLogic(logicAddress);
        logic.fake();
    }

    function callReverts(address logicAddress) public {
        IFakeLogic logic = IFakeLogic(logicAddress);
        logic.reverts();
    }

    function callSecond(address logicAddress) public {
        IFakeLogic logic = IFakeLogic(logicAddress);
        logic.second();
    }
}

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
        return "function extend(address extension) external;function getCurrentInterface() external view returns(string memory fullInterface); function getExtensions() external view returns(bytes4[] memory); function getExtensionAddresses() external view returns(address[] memory); function randomNewFunction() external;";
    }
    function getInterfaceId() override public pure returns(bytes4) {
        return type(IMockNewExtendLogic).interfaceId;
    }
}

interface IMockNewReplaceLogic {
    function replace(address oldExtension, address newExtension) external;
    function replaceWith(address oldExtension, address newExtension) external;
}

contract MockNewReplaceLogic is IMockNewReplaceLogic, Extension {
    function replace(address oldExtension, address newExtension) override public {}
    function replaceWith(address oldExtension, address newExtension) override public {}
    function getInterface() override public pure returns(string memory) {
        return "function replace(address oldExtension, address newExtension) external; function replaceWith(address oldExtension, address newExtension) external;";
    }
    function getInterfaceId() override public pure returns(bytes4) {
        return type(IMockNewReplaceLogic).interfaceId;
    }
}