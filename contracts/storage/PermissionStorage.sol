//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

struct RoleState {
    address owner;
    // Can add more for DAOs/multisigs or more complex role capture
}

library Permissions {
    bytes32 constant STORAGE_NAME = keccak256("permissions");

    function _getStorage()
        internal 
        view
        returns (RoleState storage roleStorage) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            roleStorage.slot := position
        }
    }

    function _onlyOwner() internal view {
        RoleState storage state = _getStorage();
        // PROBLEM:
        // msg.sender in Extendable contracts will often refer to itself
        // Use cases that require checking original transaction sender should use tx.origin
        // Otherwise, check msg.sender with extreme prejudice as calls can come from various unknown sources
        // This does render some use cases impossible if performing nested delegatecalls that require knowledge of the caller at a midpoint:
        // tx.origin -> contract A -> contract B -> contract A -> contract A (requires last external caller)
        //     ^                                        ^
        //     | only these two data points are checked |
        // Can be worked around by implementing logic that passes down addresses but then code security of this becomes paramount.
        // A malicious contract B can circumvent any checks that are required through an injection attack.
        
        // In order to check msg.sender properly here, we ensure that the caller is the current contract and then check tx.origin
        require(state.owner == msg.sender || (state.owner == tx.origin && msg.sender == address(this)), "unauthorised"); // Exercise EXTREME CAUTION when using this pattern elsewhere
    }

    function migrateTo(bytes32 newStorageName) internal {
        // Migrate all storage state to a new location
        // Useful in cases where new struct entries are required
    }
}