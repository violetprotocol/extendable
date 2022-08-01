//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";

/**
 * @dev Interface for PermissioningLogic extension
*/
interface IPermissioningLogic {
    /**
     * @dev Initialises the `owner` of the contract as `msg.sender`
     *
     * Requirements:
     * - `owner` cannot already be assigned
    */
    function init() external;

    /**
     * @dev Updates the `owner` to `newOwner`
    */
    function updateOwner(address newOwner) external;

    /**
     * @dev Returns the current `owner`
    */
    function getOwner() external view returns(address);
}

/**
 * @dev Abstract Extension for PermissioningLogic
*/
abstract contract PermissioningExtension is IPermissioningLogic, Extension {
    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return  "function init() external;\n"
                "function updateOwner(address newOwner) external;\n"
                "function getOwner() external view returns(address);\n";
    }

    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getImplementedInterfaces() override public pure returns(bytes4[] memory) {
        bytes4[] memory implementedInterfaces = new bytes4[](1);
        implementedInterfaces[0] = type(IPermissioningLogic).interfaceId;
        return implementedInterfaces;
    }

    /**
     * @dev see {IExtension-getFunctionSelectors}
    */
    function getFunctionSelectors() override public pure returns(bytes4[] memory) {
        bytes4[] memory implementedFunctions = new bytes4[](3);
        implementedFunctions[0] = IPermissioningLogic.init.selector;
        implementedFunctions[1] = IPermissioningLogic.updateOwner.selector;
        implementedFunctions[2] = IPermissioningLogic.getOwner.selector;
        return implementedFunctions;
    }
}