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

        IExtension ext = IExtension(extension);

        // Search for extension in interfaceIds
        uint256 numberOfInterfacesImplemented = state.implementedInterfaces.length;
        for (uint i = 0; i < numberOfInterfacesImplemented; i++) {
            bytes4 interfaceId = state.implementedInterfaces[i];
            address currentExtension = state.extensionContracts[interfaceId];

            // Check if extension matches the one we are looking for
            if (currentExtension == extension) {
                // Remove from mapping
                retractImplementionOf(interfaceId);

                return;
            }
        }

        revert("Retract: specified extension is not an extension of this contract, cannot retract");
    }

    /**
     * @dev see {IRetractLogic-retractImplementionOf}
    */
    function retractImplementionOf(bytes4 interfaceId) override public virtual onlyOwnerOrSelf {
        ExtendableState storage state = ExtendableStorage._getState();
        address implementor = state.extensionContracts[interfaceId];
        
        require(implementor != address(0x0), "Retract: interfaceId is not implemented by any extension");
    
        IExtension ext = IExtension(implementor);
        bytes4[] memory functionSelectors = ext.getFunctionSelectors();

        // Remove current contract as implementor of function selectors
        uint256 numberOfFunctionSelectors = functionSelectors.length;
        for (uint i = 0; i < numberOfFunctionSelectors; i++) {
            if (state.extensionContracts[functionSelectors[i]] == implementor) 
                delete state.extensionContracts[functionSelectors[i]];
        }

        // Search and delete interfaceId
        uint256 numberOfInterfacesImplemented = state.implementedInterfaces.length;
        for (uint i = 0; i < numberOfInterfacesImplemented; i++) {
            if (state.implementedInterfaces[i] == interfaceId) {
                // Swap interfaceId with final item and pop from array for constant time array removal
                state.implementedInterfaces[i] = state.implementedInterfaces[state.implementedInterfaces.length - 1];
                state.implementedInterfaces.pop();
            }
        }
    }
}