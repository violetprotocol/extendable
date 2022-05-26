//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../InternalExtension.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @dev Interface for ExtendLogic extension
*/
interface IERC165RegistrationLogic {
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
     */
    function _registerInterface(bytes4 interfaceId) external;
}

/**
 * @dev Abstract Extension for ExtendLogic
*/
abstract contract ERC165Extension is IERC165, IERC165RegistrationLogic, InternalExtension {
    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return  "function supportsInterface(bytes4 interfaceId) external view returns (bool);\n"
                "function _registerInterface(bytes4 interfaceId) external;\n";
    }

    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getInterfaceIds() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IERC165).interfaceId;
        interfaces[1] = type(IERC165RegistrationLogic).interfaceId;
    }

    /**
     * @dev see {IExtension-getFunctionSelectors}
    */
    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IERC165.supportsInterface.selector;
        selectors[1] = IERC165RegistrationLogic._registerInterface.selector;
    }
}