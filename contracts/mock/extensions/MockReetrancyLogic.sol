//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";
import "../../utils/ReentrancyGuard.sol";

interface IMockReentrancyLogic {
    function atomic(address target) external;
    function reatomic(address target) external;
    function singleAtomic() external;
    function singleReatomic(address target) external;
    function singleAtomicIntra(address target) external;
    function singleAtomicStrict(address target) external;
    function doubleReatomic(address target) external;
    function doubleAtomicIntra(address target) external;
    function doubleAtomicStrict(address target) external;

    function intra(address target) external;
    function reIntra(address target) external;
    function singleIntra() external;
    function singleReIntra(address target) external;
    function singleIntraAtomic(address target) external;
    function singleIntraStrict(address target) external;
    function doubleReIntra(address target) external;
    function doubleIntraAtomic(address target) external;
    function doubleIntraStrict(address target) external;

    function strict(address target) external;
    function reStrict(address target) external;
    function singleStrict() external;
    function singleReStrict(address target) external;
    function singleStrictAtomic(address target) external;
    function singleStrictIntra(address target) external;
    function doubleReStrict(address target) external;
    function doubleStrictAtomic(address target) external;
    function doubleStrictIntra(address target) external;
}



contract MockReentrancyLogic is IMockReentrancyLogic, Extension, ReentrancyGuard {
    /**
     *  nonReentrant functions
     *  Any function modified with `nonReentrant` should not be able to be called twice
     *  in the same callstack
     */

    // atomic -> atomic -> atomic -> ... recursive atomic calls
    function atomic(address target) override public nonReentrant {
        IMockReentrancyLogic(target).atomic(address(this));
    }
    
    // callRetomic -> reatomic -> callRetomic -> reatomic -> ...
    // alternating recursive callRetomic -> reatomic calls
    function callReAtomic(address target) public nonReentrant {
        IMockReentrancyLogic(target).reatomic(address(this));
    }

    function reatomic(address target) override public nonReentrant {
        callReAtomic(target);
    }

    // one shot atomic call
    function singleAtomic() override public nonReentrant {
        return;
    }

    // singleReatomic -> singleAtomic
    // one shot call to singleAtomic initiated by singleReatomic
    function singleReatomic(address target) override public nonReentrant {
        IMockReentrancyLogic(target).singleAtomic();
    }

    // singleAtomicIntra -> singleIntra
    // one shot call to singleIntra initiated by singleAtomicIntra
    function singleAtomicIntra(address target) override public nonReentrant {
        IMockReentrancyLogic(target).singleIntra();
    }

    // singleAtomicStrict -> singleStrict
    // one shot call to singleStrict initiated by singleAtomicStrict
    function singleAtomicStrict(address target) override public nonReentrant {
        IMockReentrancyLogic(target).singleStrict();
    }

    // internal doubleReatomic -> target singleReatomic -> internal singleAtomic
    // one shot alternating contract call between this contract and a target
    function doubleReatomic(address target) override public nonReentrant {
        IMockReentrancyLogic(target).singleReatomic(address(this));
    }

    // internal doubleAtomicIntra -> target singleAtomicIntra -> internal singleIntra
    // one shot alternating contract call between this contract and a target
    function doubleAtomicIntra(address target) override public nonReentrant {
        IMockReentrancyLogic(target).singleAtomicIntra(address(this));
    }

    // internal doubleAtomicStrict -> target singleAtomicStrict -> internal singleStrict
    // one shot alternating contract call between this contract and a target
    function doubleAtomicStrict(address target) override public nonReentrant {
        IMockReentrancyLogic(target).singleAtomicStrict(address(this));
    }


    /**
     *  externalNonReentrant functions
     *  Any function modified with `externalNonReentrant` should not be able to be called if
     *  another has been called in the same callstack by an external source
     */
    
    // 
    uint256 private counter = 0;
    modifier catchInfiniteRecursion {
        counter++;
        if (counter > 10) {
            counter = 0;
            revert("successful infinite recursion");
        }
        _;
    }
    
    // intra -> intra -> intra -> ...
    // recursive intra calls between a target contract and current
    function intra(address target) override public catchInfiniteRecursion externalNonReentrant {
        IMockReentrancyLogic(target).intra(address(this));
    }

    // reIntra(target) -> callReIntra(internal) -> reIntra(target) -> ...
    // recursive reIntra calls between this contract and another target contract
    function callReIntra(address target) public catchInfiniteRecursion externalNonReentrant {
        IMockReentrancyLogic(target).reIntra(address(this));
    }

    function reIntra(address target) override public externalNonReentrant {
        callReIntra(target);
    }

    // one shot intra call
    function singleIntra() override public externalNonReentrant {
        return;
    }

    // singleReIntra -> singleIntra
    // one shot call to singleIntra on another contract initiated by singleReIntra
    function singleReIntra(address target) override public externalNonReentrant {
        IMockReentrancyLogic(target).singleIntra();
    }

    // singleIntraAtomic -> singleAtomic
    // one shot call to singleAtomic initiated by singleIntraAtomic
    function singleIntraAtomic(address target) override public externalNonReentrant {
        IMockReentrancyLogic(target).singleAtomic();
    }

    // singleIntraStrict -> singleStrict
    // one shot call to singleStrict initiated by singleIntraStrict
    function singleIntraStrict(address target) override public externalNonReentrant {
        IMockReentrancyLogic(target).singleStrict();
    }

    // internal doubleReIntra -> target singleReIntra -> internal singleIntra
    // one shot alternating contract call between this contract and a target
    function doubleReIntra(address target) override public externalNonReentrant {
        IMockReentrancyLogic(target).singleReIntra(address(this));
    }

    // internal doubleIntraAtomic -> target singleIntraAtomic -> internal singleAtomic
    // one shot alternating contract call between this contract and a target
    function doubleIntraAtomic(address target) override public externalNonReentrant {
        IMockReentrancyLogic(target).singleIntraAtomic(address(this));
    }

    // internal doubleIntraStrict -> target singleIntraStrict -> internal singleStrict
    // one shot alternating contract call between this contract and a target
    function doubleIntraStrict(address target) override public externalNonReentrant {
        IMockReentrancyLogic(target).singleIntraStrict(address(this));
    }


    /**
     *  strictNonReentrant functions
     *  Any function modified with `strictNonReentrant` should not be able to be called if
     *  another has been called in the same callstack by any source
     */

    // strict -> strict -> strict -> ...
    // recursive strict calls
    function strict(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).strict(address(this));
    }

    // reStrict(target) -> reStrict(internal) -> reStrict(target) -> ...
    // recursive strict calls
    function reStrict(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).reStrict(address(this));
    }

    // one shot strict call
    function singleStrict() override public strictNonReentrant {
        return;
    }

    // singleReStrict -> singleStrict
    // single shot call to singleStrict initiated from singleReStrict
    function singleReStrict(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).singleStrict();
    }

    // singleStrictAtomic -> singleAtomic
    // single shot call to singleAtomic initiated from singleStrictAtomic
    function singleStrictAtomic(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).singleAtomic();
    }

    // singleStrictIntra -> singleIntra
    // single shot call to singleIntra initiated from singleStrictIntra
    function singleStrictIntra(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).singleIntra();
    }

    // internal doubleReStrict -> target singleReStrict -> internal singleStrict
    // double shot call to singleStrict initiated from singleReStrict
    function doubleReStrict(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).singleReStrict(address(this));
    }

    // internal doubleStrictAtomic -> target singleStrictAtomic -> internal singleAtomic
    // double shot call to singleAtomic initiated from singleStrictAtomic
    function doubleStrictAtomic(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).singleStrictAtomic(address(this));
    }

    // internal doubleStrictIntra -> target singleStrictIntra -> internal singleIntra
    // double shot call to singleIntra initiated from singleStrictIntra
    function doubleStrictIntra(address target) override public strictNonReentrant {
        IMockReentrancyLogic(target).singleStrictIntra(address(this));
    }


    /**
     *  Extension interface implementation functions
     *  Any function modified with `strictNonReentrant` should not be able to be called if
     *  another has been called in the same callstack by any source
     */

    function getInterface() override public pure returns(Interface[] memory interfaces) {
        interfaces = new Interface[](1);

        bytes4[] memory functions = new bytes4[](27);
        functions[0] = IMockReentrancyLogic.atomic.selector;
        functions[1] = IMockReentrancyLogic.reatomic.selector;
        functions[2] = IMockReentrancyLogic.singleAtomic.selector;
        functions[3] = IMockReentrancyLogic.singleReatomic.selector;
        functions[4] = IMockReentrancyLogic.singleAtomicIntra.selector;
        functions[5] = IMockReentrancyLogic.singleAtomicStrict.selector;
        functions[6] = IMockReentrancyLogic.doubleReatomic.selector;
        functions[7] = IMockReentrancyLogic.doubleAtomicIntra.selector;
        functions[8] = IMockReentrancyLogic.doubleAtomicStrict.selector;

        functions[9] = IMockReentrancyLogic.intra.selector;
        functions[10] = IMockReentrancyLogic.reIntra.selector;
        functions[11] = IMockReentrancyLogic.singleIntra.selector;
        functions[12] = IMockReentrancyLogic.singleReIntra.selector;
        functions[13] = IMockReentrancyLogic.singleIntraAtomic.selector;
        functions[14] = IMockReentrancyLogic.singleIntraStrict.selector;
        functions[15] = IMockReentrancyLogic.doubleReIntra.selector;
        functions[16] = IMockReentrancyLogic.doubleIntraAtomic.selector;
        functions[17] = IMockReentrancyLogic.doubleIntraStrict.selector;

        functions[18] = IMockReentrancyLogic.strict.selector;
        functions[19] = IMockReentrancyLogic.reStrict.selector;
        functions[20] = IMockReentrancyLogic.singleStrict.selector;
        functions[21] = IMockReentrancyLogic.singleReStrict.selector;
        functions[22] = IMockReentrancyLogic.singleStrictAtomic.selector;
        functions[23] = IMockReentrancyLogic.singleStrictIntra.selector;
        functions[24] = IMockReentrancyLogic.doubleReStrict.selector;
        functions[25] = IMockReentrancyLogic.doubleStrictAtomic.selector;
        functions[26] = IMockReentrancyLogic.doubleStrictIntra.selector;

        interfaces[0] = Interface(
            type(IMockReentrancyLogic).interfaceId,
            functions
        );
    }
    
    // very weird, separating this string on separate lines causes hardhat to slow down to a halt and 
    // yarn aborts fatally, so this needs to be in a single line until hardhat fixes
    function getSolidityInterface() override public pure returns(string memory) {
        return  "function atomic(address target) external;\nfunction reatomic(address target) external;\nfunction singleAtomic() external;\nfunction singleReatomic(address target) external;\nfunction singleAtomicIntra(address target) external;\nfunction singleAtomicStrict(address target) external;\nfunction doubleReatomic(address target) external;\nfunction doubleAtomicIntra(address target) external;\nfunction doubleAtomicStrict(address target) external;\nfunction intra(address target) external;\nfunction reIntra(address target) external;\nfunction singleIntra() external;\nfunction singleReIntra(address target) external;\nfunction singleIntraAtomic(address target) external;\nfunction singleIntraStrict(address target) external;\nfunction doubleReIntra(address target) external;\nfunction doubleIntraAtomic(address target) external;\nfunction doubleIntraStrict(address target) external;\nfunction strict(address target) external;\nfunction reStrict(address target) external;\nfunction singleStrict() external;\nfunction singleReStrict(address target) external;\nfunction singleStrictAtomic(address target) external;\nfunction singleStrictIntra(address target) external;\nfunction doubleReStrict(address target) external;\nfunction doubleStrictAtomic(address target) external;\nfunction doubleStrictIntra(address target) external;\n";
    }
}