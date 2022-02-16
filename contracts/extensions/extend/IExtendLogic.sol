//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Interface for ExtendLogic extension
*/
interface IExtendLogic {
    /**
     * @dev Extend function to extend your extendable contract with new logic
     *
     * Integrate with ExtendableStorage to persist state 
     *
     * Requirements:
     *  - `extension` contract must implement EIP-165.
     *  - Must record the `extension` by both its interfaceId and address
     *  - `extension` must inherit IExtension
     *  - The interfaceId of the "candidate" extension must not match that of an existing 
     *    attached extension
    */
    function extend(address extension) external;

    /**
     * @dev Returns a string-formatted representation of the full interface of the current
     *      Extendable contract as an interface named IExtended
     *
     * Expects `extension.getInterface` to return interface-compatible syntax with line-separated
     * function declarations including visibility, mutability and returns.
    */
    function getCurrentInterface() external view returns(string memory fullInterface);

    /**
     * @dev Returns an array of interfaceIds that are currently supported by the current
     *      Extendable contract
    */
    function getExtensions() external view returns(bytes4[] memory);

    /**
     * @dev Returns an array of all extension addresses that are currently attached to the
     *      current Extendable contract
    */
    function getExtensionAddresses() external view returns(address[] memory);
}