//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";

/**
 * @dev Interface for RetractLogic extension
*/
interface IRetractLogic {
    /**
     * @dev Removes an extension from your Extendable contract
     *
     * Requirements:
     * - `extension` must be an attached extension
    */
    function retract(address extension) external;

    /**
     * @dev Removes an extension from your Extendable contract that implements `interfaceId`
     *
     * The extension is unmarked as the implementor of the function selectors that it extends.
     *
     * Requirements:
     * - `interfaceId` must be implemented by an attached extension
    */
    function retractImplementor(bytes4 interfaceId) external;
}

abstract contract RetractExtension is IRetractLogic, Extension {
    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getInterfaceIds() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IRetractLogic).interfaceId;
    }

    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return  "function retract(address extension) external;\n"
                "function retractImplementor(bytes4 interfaceId) external;\n";
    }

    /**
     * @dev see {IExtension-getFunctionSelectors}
    */
    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IRetractLogic.retract.selector;
        selectors[1] = IRetractLogic.retractImplementor.selector;
    }
}