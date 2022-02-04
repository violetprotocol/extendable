//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../errors/Errors.sol";
import {ExtendableState, ExtendableStorage} from "../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../storage/PermissionStorage.sol";
import "../extensions/permissioning/PermissioningLogic.sol";
import "../extensions/extend/ExtendLogic.sol";

contract Extendable {
    constructor(address extendLogic, address permissionLogic) { // Feel free to customise the initialisations to use your own permissioning modules or none at all
        (bool permSuccess, ) = permissionLogic.delegatecall(abi.encodeWithSignature("init()"));
        (bool extendSuccess, ) = extendLogic.delegatecall(abi.encodeWithSignature("extend(address)", extendLogic));
        require(permSuccess, "failed to initialise permissioning");
        require(extendSuccess, "failed to initialise extension");
    }
    
    function _delegate(address implementation) internal virtual returns(bool) {
        bytes memory out;

        (bool success, bytes memory result) = implementation.delegatecall(msg.data);
        assembly {
            returndatacopy(out, 0, returndatasize())
        }

        if (!success) {
            if (Errors.catchCustomError(result, ExtensionNotImplemented.selector)) {
                return false;
            } else {
                assembly {
                    revert(out, returndatasize())
                }
            }
        } else {
            assembly {
                return(out, returndatasize())
            }
        }
    }

    function _fallback() internal virtual {
        _beforeFallback();
        ExtendableState storage state = ExtendableStorage._getStorage();

        if (state.extensionContracts[msg.sig] != address(0x0)) { // if an extension exists that matches in the functionsig, call it
            _delegate(state.extensionContracts[msg.sig]);
        } else {                                                   // else cycle through all extensions to find it if exists
            bool ok = false;
            for (uint i = 0; i < state.interfaceIds.length; i++) {
                ok = _delegate(state.extensionContracts[state.interfaceIds[i]]);
                if (ok) break; // exit after first successful execution
            }
            
            if (!ok) revert ExtensionNotImplemented(); // if there are no successful delegatecalls we assume no implementation.
        }
    }

    fallback() external payable virtual {
        _fallback();
    }
    
    receive() external payable virtual {
        _fallback();
    }

    function _beforeFallback() internal virtual {}
}
