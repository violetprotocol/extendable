//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

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