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

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IMockExtension).interfaceId);
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function test() external;\n"
                "function reverts() external;\n";
    }
}