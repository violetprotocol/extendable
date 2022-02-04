//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../Extension.sol";
import "./IReplaceLogic.sol";
import "../extend/IExtendLogic.sol";
import "../retract/IRetractLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

// Requires the Extendable to have been extended with both ExtendLogic and RetractLogic
// Replaces any old extension with any new extension except
// for ExtendLogic where new extension must match interfaceId
// Safer than ReplaceLogic
contract ReplaceLogic is IReplaceLogic, Extension {
    constructor() {
        _registerInterface(getInterfaceId());
    }

    function replace(address oldExtension, address newExtension) public override virtual {
        Permissions._onlyOwner();

        // Initialise both prior to state change for safety
        IRetractLogic retractLogic = IRetractLogic(payable(address(this)));
        IExtendLogic extendLogic = IExtendLogic(payable(address(this)));

        // remove old extension by using current retract logic instead of implementing conflicting logic
        retractLogic.retract(oldExtension);

        // attempt to extend with new extension
        try extendLogic.extend(newExtension) {
            // pass
        } catch Error(string memory reason) {
            revert(reason);
        } catch (bytes memory err) { // if it fails, check if this is due to extend being removed
            if (Errors.catchCustomError(err, ExtensionNotImplemented.selector)) { // make sure this is a not implemented error due to removal of Extend
                require(newExtension.code.length > 0, "Replace: new extend address is not a contract");

                IExtension old = IExtension(payable(oldExtension));
                IExtension newEx = IExtension(payable(newExtension));

                // upgrade this contract with modified equality below to enforce a specific new ExtendLogic interface
                require(newEx.getInterfaceId() == old.getInterfaceId(), "Replace: ExtendLogic interface of new does not match old, please only use identical ExtendLogic interfaces");
                
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