//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * Helper library for require statements for low level calls
 *
 * Checks a boolean and throws the latest returndata if false
 */
library Revert {
    function require(bool expected) internal pure {
        assembly {
            switch expected
            case 0 { 
                let ptr := mload(0x40)
                returndatacopy(ptr, 0, returndatasize())
                revert(ptr, returndatasize()) 
            }
        }
    }
}