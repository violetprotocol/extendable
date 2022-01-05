//SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.4;

import "../Logic.sol";
import "./IPermissioningLogic.sol";
import {RoleState, Permissions} from "../../storage/PermissionStorage.sol";

contract PermissioningLogic is IPermissioningLogic, Logic {
    function init() override public {
        RoleState storage state = Permissions._getStorage();
        require(state.owner == address(0x0), "already initialised"); // make sure owner has yet to be set for delegator
        state.owner = msg.sender;
    }

    function updateOwner(address newOwner) override public {
        Permissions._onlyOwner();
        RoleState storage state = Permissions._getStorage();
        state.owner = newOwner;
    }

    function getOwner() override public view returns(address) {
        RoleState storage state = Permissions._getStorage();
        return(state.owner);
    }

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IPermissioningLogic).interfaceId);
    }

    function getInterface() override public pure returns(string memory) {
        return "function init() external;function updateOwner(address newOwner) external;function getOwner() external view returns(address);";
    }
}