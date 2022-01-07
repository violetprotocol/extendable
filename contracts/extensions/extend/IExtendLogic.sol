//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IExtendLogic {
    function extend(address extension) external;

    function getCurrentInterface() external view returns(string memory fullInterface);

    function getExtensions() external view returns(bytes4[] memory);

    function getExtensionAddresses() external view returns(address[] memory);
}