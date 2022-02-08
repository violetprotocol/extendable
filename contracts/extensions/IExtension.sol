//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @dev Interface for Extension
*/
interface IExtension {
    /**
     * @dev returns a full view of the functional interface of the extension
     *
     * Must return a list of the functions in the interface of your custom Extension
     * in the same format and syntax as in the interface itself as a string, 
     * escaped-newline separated.
     *
     * OPEN TO SUGGESTIONS FOR IMPROVEMENT ON THIS METHODOLOGY FOR 
     * DEEP DESCRIPTIVE RUNTIME INTROSPECTION
     *
     * Intent is to allow developers that want to integrate with an Extendable contract
     * that will have a constantly evolving interface, due to the nature of Extendables,
     * to be able to easily inspect and query for the current state of the interface and
     * integrate with it.
     *
     * See {ExtendLogic-getInterface} for an example.
    */
    function getInterface() external pure returns(string memory);

    /**
     * @dev returns the interfaceId of current custom Extension interface
     * 
     * Provides a simple abstraction from the developer for any custom Extension to 
     * be EIP-165 compliant out-of-the-box simply by implementing this function.
     *
     * Excludes any functions either already described by other interface definitions
     * that are not developed on top of this backbone i.e. EIP-165, IExtension
    */
    function getInterfaceId() external pure returns(bytes4);
}