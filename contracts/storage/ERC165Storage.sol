//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Storage struct used to hold state for ERC165
 */
struct ERC165State {
    /**
     * @dev Mapping of interface ids to whether or not it's supported.
     */
    mapping(bytes4 => bool) _supportedInterfaces;
}

/**
 * @dev Storage library to access storage slot for the state struct
 */
library ERC165Storage {
    bytes32 constant private STORAGE_NAME = keccak256("extendable.framework.v1:erc165-state");

    function _getState()
        internal 
        view
        returns (ERC165State storage erc165State) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            erc165State.slot := position
        }
    }
}