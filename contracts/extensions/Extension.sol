//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./IExtension.sol";
import "../errors/Errors.sol";
import "../utils/CallerContext.sol";
import "../erc165/IERC165Logic.sol";

/**
 *  ______  __  __  ______  ______  __   __  _____   ______  ______  __      ______    
 * /\  ___\/\_\_\_\/\__  _\/\  ___\/\ "-.\ \/\  __-./\  __ \/\  == \/\ \    /\  ___\
 * \ \  __\\/_/\_\/\/_/\ \/\ \  __\\ \ \-.  \ \ \/\ \ \  __ \ \  __<\ \ \___\ \  __\
 *  \ \_____\/\_\/\_\ \ \_\ \ \_____\ \_\\"\_\ \____-\ \_\ \_\ \_____\ \_____\ \_____\
 *   \/_____/\/_/\/_/  \/_/  \/_____/\/_/ \/_/\/____/ \/_/\/_/\/_____/\/_____/\/_____/
 *
 *  Base contract for Extensions in the Extendable Framework
 *  
 *  Inherit and implement this contract to create Extension contracts!
 *
 *  Implements the EIP-165 standard for interface detection of implementations during runtime.
 *
 *  Define your custom Extension interface and implement it whilst inheriting this contract:
 *      contract YourExtension is IYourExtension, Extension {...}
 *
 */
abstract contract Extension is CallerContext, IExtension {
    /**
     * @dev Constructor registers your custom Extension interface under EIP-165:
     *      https://eips.ethereum.org/EIPS/eip-165
    */
    constructor() {
        bytes4[] memory interfaces = getImplementedInterfaces();
        for (uint256 i = 0; i < interfaces.length; i++) {
            _registerInterface(interfaces[i]);
        }

        bytes4[] memory functions = getFunctionSelectors();
        for (uint256 i = 0; i < functions.length; i++) {
            _registerInterface(functions[i]);
        }

        _registerInterface(type(IExtension).interfaceId);
    }

    function _registerInterface(bytes4 interfaceId) internal virtual {
        // IERC165Register(address(this)).registerInterface(interfaceId);
        address ERC165Logic = address(0x23A6e4d33CFF52F908f3Ed8f7E883D2A91A4918f);
        (bool success, bytes memory result) = ERC165Logic.delegatecall(abi.encodeWithSignature("registerInterface(bytes4)", interfaceId));

        if (!success) {
            assembly {
                revert(result, returndatasize())
            }
        }
    }

    /**
     * @dev Unidentified function signature calls to any Extension reverts with
     *      ExtensionNotImplemented error
    */
    function _fallback() internal virtual {
        address ERC165Logic = address(0x23A6e4d33CFF52F908f3Ed8f7E883D2A91A4918f);
        (bool success, bytes memory result) = ERC165Logic.delegatecall(msg.data);

        if (success) {
            assembly {
                return(result, returndatasize())
            }
        } else revert ExtensionNotImplemented();
    }

    /**
     * @dev Fallback function passes to internal _fallback() logic
    */
    fallback() external payable virtual {
        _fallback();
    }
    
    /**
     * @dev Payable fallback function passes to internal _fallback() logic
    */
    receive() external payable virtual {
        _fallback();
    }

    /**
     * @dev Virtual override declaration of getFunctionSelectors() function to silence compiler
     *
     * Must be implemented in inherited contract.
    */
    function getFunctionSelectors() override public virtual pure returns(bytes4[] memory);

    /**
     * @dev Virtual override declaration of getInterfaceId() function to silence compiler
     *
     * Must be implemented in inherited contract.
    */
    function getImplementedInterfaces() override public virtual pure returns(bytes4[] memory);
}