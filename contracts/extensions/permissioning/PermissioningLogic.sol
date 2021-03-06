//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../Extension.sol";
import "./IPermissioningLogic.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

/**
 * @dev Reference implementation for PermissioningLogic which defines the logic to control
 *      and define ownership of contracts
 *
 * Records address as `owner` in the PermissionStorage module. Modifications and access to 
 * the module affect the state wherever it is accessed by Extensions and can be read/written
 * from/to by other attached extensions.
 *
 * Currently used by the ExtendLogic reference implementation to restrict extend permissions
 * to only `owner`. Uses a common function from the storage library `_onlyOwner()` as a
 * modifier replacement. Can be wrapped in a modifier if preferred.
*/
contract PermissioningLogic is IPermissioningLogic, Extension {
    /**
     * @dev see {Extension-constructor} for constructor
    */


    /**
     * @dev modifier that restricts caller of a function to only the most recent caller if they are `owner`
    */
    modifier onlyOwner {
        address owner = Permissions._getStorage().owner;
        require(_lastCaller() == owner, "unauthorised");
        _;
    }

    /**
     * @dev see {IPermissioningLogic-init}
    */
    function init() override public {
        RoleState storage state = Permissions._getStorage();
        require(state.owner == address(0x0), "already initialised"); // make sure owner has yet to be set for delegator
        state.owner = _lastCaller();
    }

    /**
     * @dev see {IPermissioningLogic-updateOwner}
    */
    function updateOwner(address newOwner) override public onlyOwner {
        RoleState storage state = Permissions._getStorage();
        state.owner = newOwner;
    }

    /**
     * @dev see {IPermissioningLogic-getOwner}
    */
    function getOwner() override public view returns(address) {
        RoleState storage state = Permissions._getStorage();
        return(state.owner);
    }

    /**
     * @dev see {IExtension-getInterfaceId}
    */
    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IPermissioningLogic).interfaceId);
    }

    /**
     * @dev see {IExtension-getInterface}
    */
    function getInterface() override public pure returns(string memory) {
        return  "function init() external;\n"
                "function updateOwner(address newOwner) external;\n"
                "function getOwner() external view returns(address);\n";
    }
}