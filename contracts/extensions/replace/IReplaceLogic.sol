//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

interface IReplaceLogic {
    function replace(address oldExtension, address newExtension) external;
}