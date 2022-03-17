//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

struct CallerState {
    // Stores a list of callers in the order they are received
    // The current caller context is always the last-most address
    address[] callerStack;
}

library CallerContextStorage {
    bytes32 constant private STORAGE_NAME = keccak256("extendable.framework.v1:caller-state");

    function _getStorage()
        internal 
        view
        returns (CallerState storage callerStorage) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            callerStorage.slot := position
        }
    }
}