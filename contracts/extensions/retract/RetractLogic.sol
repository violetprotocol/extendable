//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import "./IRetractLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

contract RetractLogic is RetractExtension {
    /**
     * @dev see {Extension-constructor} for constructor
    */

    /**
     * @dev modifier that restricts caller of a function to only the most recent caller if they are `owner`
    */
    modifier onlyOwnerOrSelf {
        address owner = Permissions._getState().owner;
        require(_lastCaller() == owner || _lastCaller() == address(this), "unauthorised");
        _;
    }

    /**
     * @dev see {IRetractLogic-retract}
    */
    function retract(address extension) override public virtual onlyOwnerOrSelf {
        ExtendableState storage state = ExtendableStorage._getState();

        // Search for extension in interfaceIds
        uint256 numberOfInterfacesImplemented = state.implementedInterfaces.length;
        for (uint i = 0; i < numberOfInterfacesImplemented; i++) {
            bytes4 interfaceId = state.implementedInterfaces[i];
            address currentExtension = state.extensionContracts[interfaceId];

            // Check if extension matches the one we are looking for
            if (currentExtension == extension) {
                // Remove interface implementor
                delete state.extensionContracts[interfaceId];
                state.implementedInterfaces[i] = state.implementedInterfaces[state.implementedInterfaces.length - 1];
                state.implementedInterfaces.pop();

                // Remove function selector implementor
                uint256 numberOfFunctionsImplemented = state.implementedFunctionsByInterfaceId[interfaceId].length;
                for (uint j = 0; j < numberOfFunctionsImplemented; j++) {
                    bytes4 functionSelector = state.implementedFunctionsByInterfaceId[interfaceId][j];
                    delete state.extensionContracts[functionSelector];
                }
                delete state.implementedFunctionsByInterfaceId[interfaceId];
            }
        }
    }
}