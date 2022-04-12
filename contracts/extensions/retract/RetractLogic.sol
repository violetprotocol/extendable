//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import "./IRetractLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

contract RetractLogic is IRetractLogic, Extension {
    /**
     * @dev see {Extension-constructor} for constructor
    */

    /**
     * @dev modifier that restricts caller of a function to only the most recent caller if they are `owner`
    */
    modifier onlyOwnerOrSelf {
        address owner = Permissions._getStorage().owner;
        require(_lastCaller() == owner || _lastCaller() == address(this), "unauthorised");
        _;
    }

    /**
     * @dev see {IRetractLogic-retract}
    */
    function retract(address extension) override public virtual onlyOwnerOrSelf {
        ExtendableState storage state = ExtendableStorage._getStorage();

        // Search for extension in interfaceIds
        for (uint i = 0; i < state.interfaceIds.length; i++) {
            bytes4 interfaceId = state.interfaceIds[i];
            address currentExtension = state.extensionContracts[interfaceId];

            // Check if extension matches the one we are looking for
            if (currentExtension == extension) {
                // Remove from mapping
                delete state.extensionContracts[interfaceId];

                // Swap interfaceId with final item and pop from array for constant time array removal
                state.interfaceIds[i] = state.interfaceIds[state.interfaceIds.length - 1];
                state.interfaceIds.pop();

                return;
            }
        }

        revert("Retract: specified extension is not an extension of this contract, cannot retract");
    }

    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getInterfaceId() override public pure returns(bytes4) {
        return (type(IRetractLogic).interfaceId);
    }

    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return "function retract(address extension) external;\n";
    }
}