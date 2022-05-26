//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../InternalExtension.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./IERC165Logic.sol";

/**
 * @dev Abstract Extension for ExtendLogic
 * 
 * Declared separately from IERC165RegistrationLogic due to the circular imports caused by Extension.sol
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