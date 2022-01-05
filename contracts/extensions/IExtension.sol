//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IExtension {
    function getInterface() external pure returns(string memory);
    function getInterfaceId() external pure returns(bytes4);
}