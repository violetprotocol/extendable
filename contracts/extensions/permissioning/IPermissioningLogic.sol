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
     * @dev see {IExtension-getSolidityInterface}
    */
    function getSolidityInterface() override public pure returns(string memory) {
        return  "function init() external;\n"
                "function updateOwner(address newOwner) external;\n"
                "function getOwner() external view returns(address);\n";
    }

    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](3);
        functions[0] = IPermissioningLogic.init.selector;
        functions[1] = IPermissioningLogic.updateOwner.selector;
        functions[2] = IPermissioningLogic.getOwner.selector;

        interfaces[0] = Interface(
            type(IPermissioningLogic).interfaceId,
            functions
        );
    }
}