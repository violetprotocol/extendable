//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "./IExtension.sol";
import "../errors/Errors.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Storage.sol";

abstract contract Extension is ERC165Storage, IExtension {
    function _fallback() internal virtual {
        revert ExtensionNotImplemented();
    }

    fallback() external payable virtual {
        _fallback();
    }
    
    receive() external payable virtual {
        _fallback();
    }
}