//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// Create a mismatched interface for the MockExtension
interface IFakeExtension {
    function test() external;
    function fake() external;
    function reverts() external;
}

// Create a caller that uses the mismatched interface that should fail on fake calls
contract MockExtensionCaller {
    function callTest(address extensionAddress) public {
        IFakeExtension extension = IFakeExtension(extensionAddress);
        extension.test();
    }

    function callFake(address extensionAddress) public {
        IFakeExtension extension = IFakeExtension(extensionAddress);
        extension.fake();
    }

    function callReverts(address extensionAddress) public {
        IFakeExtension extension = IFakeExtension(extensionAddress);
        extension.reverts();
    }
}