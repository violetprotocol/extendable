//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";

/**
 * @dev Interface for ExtendLogic extension
*/
interface IExtendLogic {
    /**
     * @dev Extend function to extend your extendable contract with new logic
     *
     * Integrate with ExtendableStorage to persist state
     *
     * Sets the known implementor of each function of `extension` as the current call context
     * contract.
     *
     * Requirements:
     *  - `extension` contract must implement EIP-165.
     *  - `extension` must inherit IExtension
     *  - Must record the `extension` by both its interfaceId and address
     *  - The functions of `extension` must not already be extended by another attached extension
    */
    function extend(address extension) external;

    /**
     * @dev Returns a string-formatted representation of the full interface of the current
     *      Extendable contract as an interface named IExtended
     *
     * Expects `extension.getInterface` to return interface-compatible syntax with line-separated
     * function declarations including visibility, mutability and returns.
    */
    function getCurrentInterface() external view returns(string memory fullInterface);

    /**
     * @dev Returns an array of interfaceIds that are currently supported by the current
     *      Extendable contract
    */
    function getExtensions() external view returns(bytes4[] memory);

    /**
     * @dev Returns an array of all extension addresses that are currently attached to the
     *      current Extendable contract
    */
    function getExtensionAddresses() external view returns(address[] memory);
}

/**
 * @dev Abstract Extension for ExtendLogic
*/
abstract contract ExtendExtension is IExtendLogic, Extension {
    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return  "function extend(address extension) external;\n"
                "function getCurrentInterface() external view returns(string memory);\n"
                "function getExtensions() external view returns(bytes4[] memory);\n"
                "function getExtensionAddresses() external view returns(address[] memory);\n";
    }

    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getImplementedInterfaces() override public pure returns(bytes4[] memory) {
        bytes4[] memory implementedInterfaces = new bytes4[](1);
        implementedInterfaces[0] = type(IExtendLogic).interfaceId;
        return implementedInterfaces;
    }

    /**
     * @dev see {IExtension-getFunctionSelectors}
    */
    function getFunctionSelectors() override public pure returns(bytes4[] memory) {
        bytes4[] memory implementedFunctions = new bytes4[](4);
        implementedFunctions[0] = IExtendLogic.extend.selector;
        implementedFunctions[1] = IExtendLogic.getCurrentInterface.selector;
        implementedFunctions[2] = IExtendLogic.getExtensionAddresses.selector;
        implementedFunctions[3] = IExtendLogic.getExtensions.selector;
        return implementedFunctions;
    }
}