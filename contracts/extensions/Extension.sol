//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IExtension.sol";
import "../errors/Errors.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

abstract contract Extension is ERC165Storage, IExtension {
    constructor() {
        _registerInterface(getInterfaceId());
    }

    function _fallback() internal virtual {
        revert ExtensionNotImplemented();
    }

    fallback() external payable virtual {
        _fallback();
    }
    
    receive() external payable virtual {
        _fallback();
    }

    function getInterfaceId() override public virtual pure returns(bytes4);
}