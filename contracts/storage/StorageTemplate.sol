//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Define your storage variables into a struct like below
**/
struct YourStruct {
    uint someUint;
    // Add your own storage variables here
}

/**
 * @dev Your storage variable struct is accessible by all your extensions
 *      using the library pattern below.
 *
 * Name your storage accessor identifier to direct storage into deterministic
 * slots where your struct will be located. Be careful not to use commonly used
 * names that could be used by other storage modules which could cause data corruption.
**/
library StorageTemplate {
    // This is used in combination with delegator address to locate your struct in storage
    // Choose something that is human readable/understandable and unique to avoid potential
    // collisions with other potential storage libraries used by the same delegator
    bytes32 constant private STORAGE_NAME = keccak256("your_unique_storage_identifier");

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
}