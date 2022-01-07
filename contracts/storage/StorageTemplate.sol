//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";

struct YourStruct {
    uint someUint;
    // Add your own storage variables here
}

library StorageTemplate {
    // This is used in combination with delegator address to locate your struct in storage
    // Choose something that is human readable/understandable and unique to avoid potential
    // collisions with other potential storage libraries used by the same delegator
    bytes32 constant STORAGE_NAME = keccak256("your_unique_storage_identifier");

    function _getStorage()
        internal 
        view
        returns (YourStruct storage state) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            state.slot := position
        }
    }

    // Upgrading/extending/modifying your storage structs may cause a change in storage layout
    // In such cases, pre-emptively performing migration logic of existing state may aid in
    // transitioning.
    function migrateTo(bytes32 newStorageName) internal {
        // Migrate all storage state to a new location
        // Useful in cases where new struct entries are required
    }
}