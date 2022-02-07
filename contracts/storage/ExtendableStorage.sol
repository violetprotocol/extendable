//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Storage struct used to hold state for Extendable contracts
 */
struct ExtendableState {
    // Array of interfaceIds extended by the Extendable contract instance
    bytes4[] interfaceIds;

    // Mapping of interfaceId to the extension address that implements it
    mapping(bytes4 => address) extensionContracts;
}

/**
 * @dev Storage library to access storage slot for the state struct
 */
library ExtendableStorage {
    bytes32 constant STORAGE_NAME = keccak256("extendable");

    function _getStorage()
        internal 
        view
        returns (ExtendableState storage extendableStorage) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            extendableStorage.slot := position
        }
    }
}