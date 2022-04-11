//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

struct CalledState {
    // Records an chronologically ordered array of function signatures as the current callchain
    bytes4[] calledFunctions;
    // Stores a mapping of function signatures against whether or not it has been called
    // in the current callchain
    mapping(bytes4 => bool) hasBeenCalled;
}

library ReentrancyStorage {
    bytes32 constant private STORAGE_NAME = keccak256("extendable.framework.v1:reentrancy-guard");

    function _getStorage()
        internal 
        view
        returns (CalledState storage calledStorage) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            calledStorage.slot := position
        }
    }
}