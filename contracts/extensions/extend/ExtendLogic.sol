//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "../Extension.sol";
import "./IExtendLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

contract ExtendLogic is IExtendLogic, Extension {
    constructor() {
        _registerInterface(getInterfaceId());
    }

    function extend(address extension) override public virtual {
        Permissions._onlyOwner();
        
        require(extension.code.length > 0, "ExtendLogic: address is not a contract");

        ExtendableState storage state = ExtendableStorage._getStorage();
        IExtension ext = IExtension(payable(extension));
        require(state.extensionContracts[ext.getInterfaceId()] == address(0x0), "Extend: extension already exists for interfaceId");

        state.interfaceIds.push(ext.getInterfaceId());
        state.extensionContracts[ext.getInterfaceId()] = extension;
    }

    function getCurrentInterface() override public view returns(string memory fullInterface) {
        ExtendableState storage state = ExtendableStorage._getStorage();
        for (uint i = 0; i < state.interfaceIds.length; i++) {
            bytes4 interfaceId = state.interfaceIds[i];
            IExtension logic = IExtension(state.extensionContracts[interfaceId]);
            fullInterface = string(abi.encodePacked(fullInterface, logic.getInterface()));
        }

        // TO-DO change this return to a standardised format with comments for developers
        return string(abi.encodePacked("interface IExtended {", fullInterface, "}"));
    }

    function getExtensions() override public view returns(bytes4[] memory) {
        ExtendableState storage state = ExtendableStorage._getStorage();
        return state.interfaceIds;
    }

    function getExtensionAddresses() override public view returns(address[] memory) {
        ExtendableState storage state = ExtendableStorage._getStorage();
        address[] memory addresses = new address[](state.interfaceIds.length);
        
        for (uint i = 0; i < state.interfaceIds.length; i++) {
            bytes4 interfaceId = state.interfaceIds[i];
            addresses[i] = state.extensionContracts[interfaceId];
        }
        return addresses;
    }

    function getInterface() override public pure returns(string memory) {
        return "function extend(address extension) external;function getCurrentInterface() external view returns(string memory);function getExtensions() external view returns(bytes4[] memory);function getExtensionAddresses() external view returns(address[] memory);";
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IExtendLogic).interfaceId);
    }
}