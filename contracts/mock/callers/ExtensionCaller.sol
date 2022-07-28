//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../erc165/IERC165Logic.sol";
import "../../extensions/Extension.sol";
import "hardhat/console.sol";

// Create a caller that calls EIP-165 implemented functions
contract ExtensionCaller {
    function callSupportsInterface(address extensionAddress, bytes4 interfaceId) public returns(bool) {
        IERC165 extension = IERC165(extensionAddress);
        console.log("calling");
        bool supported = extension.supportsInterface(interfaceId);
        console.log("is supported");
        console.logBool(supported);
        return supported;
    }

    function callRegisterInterface(address extensionAddress, bytes4 interfaceId) public {
        IERC165Register extension = IERC165Register(extensionAddress);
        extension.registerInterface(interfaceId);
    }

    function callTrue(address extensionAddress) public returns(bool) {
        (bool success, bytes memory result) = extensionAddress.call(abi.encodeWithSignature("returnTrue()"));
        console.logBytes(result);
        console.logBool(abi.decode(result, (bool)));
        return(abi.decode(result, (bool)));
    }
}