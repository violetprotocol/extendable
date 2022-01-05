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
contract ReplaceLogic is IReplaceLogic, Extension {
    constructor() {
        _registerInterface(getInterfaceId());
    }

    function replace(address oldExtension, address newExtension) public override virtual {
        Permissions._onlyOwner();

        // Initialise both prior to state change for safety
        IRetractLogic retractLogic = IRetractLogic(payable(address(this)));

        // remove old extension by using current retract logic instead of implementing conflicting logic
        retractLogic.retract(oldExtension);

        // check if we are replacing ExtendLogic with new
        IExtension old = IExtension(payable(oldExtension));
        bool isReplacingExtend = old.getInterfaceId() == type(IExtendLogic).interfaceId;
        if (isReplacingExtend) {
            // check if new extension implements the correct interface
            IExtension newEx = IExtension(payable(newExtension));

            // upgrade this contract with modified equality below to enforce a specific new ExtendLogic interface
            require(newEx.getInterfaceId() == old.getInterfaceId(), "Replace: ExtendLogic interface of new does not match old, please only use identical ExtendLogic interfaces");
            
            // use raw delegate call to re-extend the extension because we have just removed the Extend function
            (bool extendSuccess, ) = newExtension.delegatecall(abi.encodeWithSignature("extend(address)", newExtension));
            require(extendSuccess, "Replace: failed to replace extend");
        } else {
            // reregister using current extend logic instead of implementing conflicting logic
            IExtendLogic extendLogic = IExtendLogic(payable(address(this)));
            extendLogic.extend(newExtension);
        }
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return (type(IReplaceLogic).interfaceId);
    }

    function getInterface() override public pure returns(string memory) {
        return "function replace(address oldExtension, address newExtension) external;";
    }
}