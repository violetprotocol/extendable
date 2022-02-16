//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Interface for RetractLogic extension
*/
interface IRetractLogic {

    /**
     * @dev Removes an extension from your Extendable contract
     *
     * Requirements:
     * - `extension` must be an attached extension
    */
    function retract(address extension) external;
}