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
     * @notice Updates the `owner` to `newOwner`
    */
    function updateOwner(address newOwner) external;

    /**
     * @notice Give up ownership of the contract.
     * Proceed with extreme caution as this action is irreversible!!
     *
     * Requirements:
     * - can only be called by the current `owner`
    */
    function renounceOwnership() external;

    /**
     * @notice Returns the current `owner`
    */
    function getOwner() external view returns(address);
}