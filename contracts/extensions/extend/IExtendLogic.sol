//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IExtendLogic {
    /**
     * @dev extend function to extend your extendable contract with new logic
     *
     * Requirements:
     *  - `extension` contract must implement EIP-165.
     *  - Records `extension` in the ExtendableStorage module.
     *  - Fail if `extension` does not implement IExtension
     *  - Fail if the interfaceId of the `candidate` extension matches that of an existing 
     *    attached extension
    */
    function extend(address extension) external;


    function getCurrentInterface() external view returns(string memory fullInterface);
    function getExtensions() external view returns(bytes4[] memory);
    function getExtensionAddresses() external view returns(address[] memory);
}