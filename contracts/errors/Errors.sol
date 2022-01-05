//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

error ExtensionNotImplemented();

library Errors {
    function catchCustomError(bytes memory result, bytes4 errorSelector) internal pure returns(bool) {
        bytes4 caught;
        assembly {
            caught := mload(add(result, 0x20))
        }

        return caught == errorSelector;
    }
}