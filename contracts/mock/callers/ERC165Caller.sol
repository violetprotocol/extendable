//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../errors/Errors.sol";
import "../../erc165/ERC165Logic.sol";
import "./Revert.sol";

/**
 * Mock caller for erc165.test.js
 * 
 * Tests ERC165Logic without Extendable.sol as standalone unit
 */
contract ERC165Caller {
    ERC165Logic internal _erc165Logic;

    constructor(address erc165Logic) {
        _erc165Logic = ERC165Logic(erc165Logic);
    }

    function callSupportsInterface(bytes4 interfaceId) public returns(bool) {
        (bool success, bytes memory result) = address(_erc165Logic).delegatecall(abi.encodeWithSignature("supportsInterface(bytes4)", interfaceId));
        Revert.require(success);
        return abi.decode(result, (bool));
    }

    function callRegisterInterface(bytes4 interfaceId) public {
        (bool success, ) = address(_erc165Logic).delegatecall(abi.encodeWithSignature("_registerInterface(bytes4)", interfaceId));
        Revert.require(success);
    }

    function callExternalSupportsInterface(bytes4 interfaceId) public returns(bool) {
        return _erc165Logic.supportsInterface(interfaceId);
    }

    function callExternalRegisterInterface(bytes4 interfaceId) public {
        _erc165Logic.registerInterface(interfaceId);
    }
}