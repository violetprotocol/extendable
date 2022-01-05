//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../Extension.sol";
import "./IReplaceLogic.sol";
import "../extend/IExtendLogic.sol";
import "../retract/IRetractLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

// Requires the Extendable to have been extended with both ExtendLogic and RetractLogic
// Only allows replacement of extensions that share the exact same interface
contract StrictReplaceLogic is IReplaceLogic, Extension {
    constructor() {
        _registerInterface(getInterfaceId());
    }

    function replace(address oldExtension, address newExtension) public override virtual {
        Permissions._onlyOwner();

        IExtension old = IExtension(payable(oldExtension));
        IExtension newEx = IExtension(payable(newExtension));
        require(newEx.getInterfaceId() == old.getInterfaceId(), "Replace: interface of new does not match old, please only use identical interfaces");

        // Initialise both prior to state change for safety
        IRetractLogic retractLogic = IRetractLogic(payable(address(this)));
        IExtendLogic extendLogic = IExtendLogic(payable(address(this)));

        // remove old extension by using current retract logic instead of implementing conflicting logic
        retractLogic.retract(oldExtension);

        // attempt to extend with new extension
        try extendLogic.extend(newExtension) {
            // pass
        } catch (bytes memory err) { // if it fails, check if this is due to extend being removed
            if (Errors.catchCustomError(err, ExtensionNotImplemented.selector)) { // make sure this is a not implemented error due to removal of Extend
                // use raw delegate call to re-extend the extension because we have just removed the Extend function
                (bool extendSuccess, ) = newExtension.delegatecall(abi.encodeWithSignature("extend(address)", newExtension));
                require(extendSuccess, "Replace: failed to replace extend");
            } else {
                uint errLen = err.length;
                assembly {
                    revert(err, errLen)
                }
            }
        }
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return (type(IReplaceLogic).interfaceId);
    }

    function getInterface() override public pure returns(string memory) {
        return "function replace(address oldExtension, address newExtension) external;";
    }
}