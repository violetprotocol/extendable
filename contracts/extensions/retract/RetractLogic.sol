//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../Logic.sol";
import "./IRetractLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

contract RetractLogic is IRetractLogic, Extension {
    constructor() {
        _registerInterface(getInterfaceId());
    }

    function retract(address extension) override public virtual {
        Permissions._onlyOwner();

        ExtendableState storage state = ExtendableStorage._getStorage();
        for (uint i = 0; i < state.interfaceIds.length; i++) {
            bytes4 interfaceId = state.interfaceIds[i];
            address currentExtension = state.extensionContracts[interfaceId];
            if (currentExtension == extension) {
                delete state.extensionContracts[interfaceId];

                // swap with final item and pop from array
                state.interfaceIds[i] = state.interfaceIds[state.interfaceIds.length - 1];
                state.interfaceIds.pop();

                return;
            }
        }

        revert("Retract: specified extension does not exist, cannot retract");
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return (type(IRetractLogic).interfaceId);
    }

    function getInterface() override public pure returns(string memory) {
        return "function retract(address extension) external;";
    }
}