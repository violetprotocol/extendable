//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";

/**
 * @dev Interface for ReplaceLogic extension
*/
interface IReplaceLogic {
    /**
     * @dev Replaces `oldExtension` with `newExtension`
     *
     * Performs consecutive execution of retract and extend.
     * First the old extension is retracted using RetractLogic.
     * Second the new extension is attached using ExtendLogic.
     *
     * Since replace does not add any unique functionality aside from a
     * composition of two existing functionalities, it is best to make use
     * of those functionalities, hence the re-use of RetractLogic and 
     * ExtendLogic.
     * 
     * However, if custom logic is desired, exercise caution during 
     * implementation to avoid conflicting methods for add/removing extensions
     *
     * Requirements:
     * - `oldExtension` must be an already attached extension
     * - `newExtension` must be a contract that implements IExtension
    */
    function replace(address oldExtension, address newExtension) external;
}

abstract contract ReplaceExtension is IReplaceLogic, Extension {
    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getImplementedInterfaces() override public pure returns(bytes4[] memory interfaces) {
        interfaces[0] = type(IReplaceLogic).interfaceId;
    }

    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return  "function replace(address oldExtension, address newExtension) external;\n";
    }

    /**
     * @dev see {IExtension-getFunctionSelectors}
    */
    function getFunctionSelectors() override public pure returns(bytes4[] memory selectors) {
        selectors[0] = IReplaceLogic.replace.selector;
    }
}