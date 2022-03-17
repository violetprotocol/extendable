//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Internal {
    modifier _internal() {
        require(msg.sender == address(this), "external caller not allowed");
        _;
    }
}