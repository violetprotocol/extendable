//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import "./IExtendLogic.sol";
import {ExtendableState, ExtendableStorage} from "../../storage/ExtendableStorage.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";
import "../../erc165/IERC165Logic.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @dev Reference implementation for ExtendLogic which defines the logic to extend
 *      Extendable contracts
 *
 * Uses PermissioningLogic owner pattern to control extensibility. Only the `owner`
 * can extend using this logic.
 *
 * Modify this ExtendLogic extension to change the way that your contract can be
 * extended: public extendability; DAO-based extendability; governance-vote-based etc.
*/
contract ExtendLogic is ExtendExtension {
    /**
     * @dev see {Extension-constructor} for constructor
    */

    /**
     * @dev modifier that restricts caller of a function to only the most recent caller if they are `owner` or the current contract
    */
    modifier onlyOwnerOrSelf {
        initialise();
    
        address owner = Permissions._getState().owner;
        require(_lastCaller() == owner || _lastCaller() == address(this), "unauthorised");
        _;
    }

    /**
     * @dev see {IExtendLogic-extend}
     *
     * Uses PermissioningLogic implementation with `owner` checks.
     *
     * Restricts extend to `onlyOwnerOrSelf`.
     *
     * If `owner` has not been initialised, assume that this is the initial extend call
     * during constructor of Extendable and instantiate `owner` as the caller.
     *
     * If any single function in the extension has already been extended by another extension,
     * revert the transaction.
    */
    function extend(address extension) override public virtual onlyOwnerOrSelf {
        require(extension.code.length > 0, "Extend: address is not a contract");

        IERC165 erc165Extension = IERC165(extension);
        try erc165Extension.supportsInterface(bytes4(0x01ffc9a7)) returns(bool erc165supported) {
            require(erc165supported, "Extend: extension does not implement eip-165");
            require(erc165Extension.supportsInterface(type(IExtension).interfaceId), "Extend: extension does not implement IExtension");
        } catch (bytes memory) {
            revert("Extend: extension does not implement eip-165");
        }

        IExtension ext = IExtension(payable(extension));
        ExtendableState storage state = ExtendableStorage._getState();

        bytes4[] memory functions = ext.getFunctionSelectors();
        uint256 numberOfFunctions = functions.length;
        for (uint256 i = 0; i < numberOfFunctions; i++) {
            require(
                state.extensionContracts[functions[i]] == address(0x0),
                string(abi.encodePacked("Extend: function ", Strings.toHexString(uint256(uint32(functions[i])), 4)," is already implemented by ", Strings.toHexString(state.extensionContracts[functions[i]])))
            );

            state.extensionContracts[functions[i]] = extension;
            state.implementedFunctions.push(functions[i]);
        }

        bytes4[] memory interfaces = ext.getImplementedInterfaces();
        uint256 numberOfInterfaces = interfaces.length;
        for (uint256 i = 0; i < numberOfInterfaces; i++) { 
            require(
                state.extensionContracts[interfaces[i]] == address(0x0),
                string(abi.encodePacked("Extend: interface ", Strings.toHexString(uint256(uint32(interfaces[i])), 4)," is already implemented by ", Strings.toHexString(state.extensionContracts[interfaces[i]])))
            );

            // Set the implementer of the full interfaceId to the extension
            state.implementedInterfaces.push(interfaces[i]);
            state.extensionContracts[interfaces[i]] = extension;
        }
    }

    /**
     * @dev see {IExtendLogic-getCurrentInterface}
    */
    function getCurrentInterface() override public view returns(string memory fullInterface) {
        ExtendableState storage state = ExtendableStorage._getState();
        for (uint i = 0; i < state.implementedInterfaces.length; i++) {
            bytes4 interfaceId = state.implementedInterfaces[i];
            IExtension logic = IExtension(state.extensionContracts[interfaceId]);
            fullInterface = string(abi.encodePacked(fullInterface, logic.getInterface()));
        }

        // TO-DO optimise this return to a standardised format with comments for developers
        return string(abi.encodePacked("interface IExtended {\n", fullInterface, "}"));
    }

    /**
     * @dev see {IExtendLogic-getExtensions}
    */
    function getExtensions() override public view returns(bytes4[] memory) {
        ExtendableState storage state = ExtendableStorage._getState();
        return state.implementedInterfaces;
    }

    /**
     * @dev see {IExtendLogic-getExtensionAddresses}
    */
    function getExtensionAddresses() override public view returns(address[] memory) {
        ExtendableState storage state = ExtendableStorage._getState();
        address[] memory addresses = new address[](state.implementedInterfaces.length);
        
        for (uint i = 0; i < state.implementedInterfaces.length; i++) {
            bytes4 interfaceId = state.implementedInterfaces[i];
            addresses[i] = state.extensionContracts[interfaceId];
        }
        return addresses;
    }

    /**
     * @dev Sets the owner of the contract to the tx origin if unset
     *
     * Used by Extendable during first extend to set deployer as the owner that can
     * extend the contract
    */
    function initialise() internal {
        RoleState storage state = Permissions._getState();

        // Set the owner to the transaction sender if owner has not been initialised
        if (state.owner == address(0x0)) {
            state.owner = _lastCaller();
        }
    }
}