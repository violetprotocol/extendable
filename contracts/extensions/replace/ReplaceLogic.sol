//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import "./IReplaceLogic.sol";
import "../extend/IExtendLogic.sol";
import "../retract/IRetractLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

/**
 * @dev Reference implementation for ReplaceLogic which defines a basic extension
 *      replacement algorithm.
*/
contract ReplaceLogic is IReplaceLogic, Extension {
    /**
     * @dev see {Extension-constructor} for constructor
    */

    /**
     * @dev modifier that restricts caller of a function to only the most recent caller if they are `owner`
    */
    modifier onlyOwner {
        address owner = Permissions._getState().owner;
        require(_lastCaller() == owner, "unauthorised");
        _;
    }

    /**
     * @dev see {IReplaceLogic-replace} Replaces any old extension with any new extension.
     *
     * Uses RetractLogic to remove old and ExtendLogic to add new.
     *
     * If ExtendLogic is being replaced, ensure that the new extension implements IExtendLogic
     * and use low-level calls to extend.
    */
    function replace(address oldExtension, address newExtension) public override virtual onlyOwner {
        // Initialise both prior to state change for safety
        IRetractLogic retractLogic = IRetractLogic(payable(address(this)));
        IExtendLogic extendLogic = IExtendLogic(payable(address(this)));

        // Remove old extension by using current retract logic instead of implementing conflicting logic
        retractLogic.retract(oldExtension);

        // Attempt to extend with new extension
        try extendLogic.extend(newExtension) {
            // success
        } catch Error(string memory reason) {
            revert(reason);
        } catch (bytes memory err) { // if it fails, check if this is due to extend being replaced
            if (Errors.catchCustomError(err, ExtensionNotImplemented.selector)) { // make sure this is a not implemented error due to removal of Extend
                require(newExtension.code.length > 0, "Replace: new extend address is not a contract");

                IExtension old = IExtension(payable(oldExtension));
                IExtension newEx = IExtension(payable(newExtension));

                // @dev: upgrade this contract with modified equality below to enforce a specific new ExtendLogic interface
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

    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getInterfaceId() override public pure returns(bytes4) {
        return (type(IReplaceLogic).interfaceId);
    }

    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return "function replace(address oldExtension, address newExtension) external;\n";
    }
}