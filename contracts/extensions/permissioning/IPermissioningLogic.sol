//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IPermissioningLogic {
    function init() external;
    function updateOwner(address newOwner) external;
    function getOwner() external view returns(address);
}