// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./IERC165Logic.sol";

/**
 * @dev Storage based implementation of the {IERC165} interface.
 *
 * Contracts may extend this and call {_registerInterface} to declare
 * their support of an interface.
 */
contract ERC165Logic is ERC165Extension {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) override public view virtual returns (bool) {
        return super.supportsInterface(interfaceId) || _supportedInterfaces[interfaceId];
    }

    /**
     * @dev Registers the contract as an implementer of the interface defined by
     * `interfaceId`. Support of the actual ERC165 interface is automatic and
     * registering its interface id is not required.
     *
     * See {IERC165-supportsInterface}.
     *
     * Requirements:
     *
     * - `interfaceId` cannot be the ERC165 invalid interface (`0xffffffff`).
     * - should only be callable by other extensions of the same contract
     */
    function _registerInterface(bytes4 interfaceId) override public _internal virtual {
        require(interfaceId != 0xffffffff, "ERC165: invalid interface id");
        _supportedInterfaces[interfaceId] = true;
    }
}