//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

struct ExtendableState {
    bytes4[] interfaceIds;
    mapping(bytes4 => address) extensionContracts;
}

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

    function migrateTo(bytes32 newStorageName) internal {
        // Migrate all storage state to a new location
        // Useful in cases where new struct entries are required
    }
}