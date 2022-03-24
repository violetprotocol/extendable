//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import { CalledState, ReentrancyStorage } from "../storage/ReentrancyStorage.sol";
import "./CallerContext.sol";

/**
 * @dev ReentrancyGuard contract provides Extensions with a new type of guard against re-entrancy.
 *
 * Since Re-entrancy can come in many different forms, Extendables also create new attack vectors.
 *
 * This contract provides guards against total reentrancy to a contract, to a function, and within a contract.
 *
 * The three cases are motivated by the following scenarios:
 *      - Extendable contracts now have extensions that are scattered across many contracts that may
 *        need to call to each other. This is known as intra-reentrancy where the developer deems
 *        it safe for any Extension to reenter the contract and its functions any number of times, whilst
 *        restricting reentrancy to external sources.
 *      - Functions may have 'one-shot' type of logic execution where its code must only be run once,
 *        and any attempt for it to be called again, either through malicious replay or accident should be
 *        prevented. However there may be other functions within the contract that can be callable that should
 *        not be restricted by a contract-wide guard. This is known as atomic reentrancy.
 *      - Traditional reentry where if any function that is modified with a reentrancy guard on the same contract
 *        execution is halted. This is known as contract reentrancy.
 *
 * These distinctions are important in a case where we have more complex smart contract architecture with Extendable
 * and code execution across extensions themselves may be unsafe, or allowable in different cases. The added complexity
 * comes from the potential unpredictability of the way some Extensions could give external contracts access to internal
 * parts of the contract. By using very clearly delineated guards, developing Extensions in isolated can still be safe
 * despite composability concerns.
*/
contract ReentrancyGuard is CallerContext {
    /**
     * @dev Guards against atomic reentrancy from all sources
     *
     * A contract can be re-entered if a different function is called
     */
    modifier nonReentrant {
        CalledState storage calledState = ReentrancyStorage._getStorage();
        require(!calledState.hasBeenCalled[msg.sig], "nonReentrant: atomic re-entrancy disallowed");

        calledState.hasBeenCalled[msg.sig] = true;
        calledState.calledFuncSigs.push(msg.sig);
        _;
        calledState.hasBeenCalled[msg.sig] = false;
        calledState.calledFuncSigs.pop();
    }

    /**
     * @dev Guards against contract reentrancy from external sources
     *
     * Only allows intra-reentrancy.
     */
    modifier externalNonReentrant {
        require(_lastCaller() == address(this), "externalNonReentrant: only intra calls allowed");
        _;
    }

    /**
     * @dev Guards against contract reentrancy from all sources
     *
     * Disallows all entrancy to modified functions in the same contract.
     */
    modifier strictNonReentrant {
        CalledState storage calledState = ReentrancyStorage._getStorage();
        require(calledState.calledFuncSigs.length == 0, "strictNonReentrancy: no contract re-entrancy allowed");
        _;
    }
}