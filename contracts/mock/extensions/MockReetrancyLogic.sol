//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "../../extensions/Extension.sol";
import "../../utils/ReentrancyGuard.sol";

interface IMockReetrancyLogic {
    function atomic() external;
    function reatomic() external;
    function singleAtomic() external;
    function singleAtomicIntra() external;
    function singleAtomicStrict(address target) external;

    function intra() external;
    function reIntra(address target) external;
    function singleIntra() external;
    function reSingleIntra(address target) external;
    function singleIntraAtomic() external;
    function singleIntraStrict(address target) external;

    function strict() external;
    function reStrict(address target) external;
    function singleStrict() external;
}

contract MockReetrancyLogic is IMockReetrancyLogic, Extension, ReentrancyGuard {
    bool internal called;

    // Ends recursion if we successfully re-enter
    modifier trackReentrancy() {
        if (called) {
            called = false;
            return;
        }

        called = true;
        _;
        called = false;
    }

    /**
     *  nonReentrant functions
     *  Any function modified with `nonReentrant` should not be able to be called twice
     *  in the same callstack
     */

    // atomic -> atomic -> atomic -> ... recursive atomic calls
    function atomic() override public nonReentrant trackReentrancy {
        IMockReetrancyLogic(address(this)).atomic();
    }
    
    // callAtomic -> reatomic -> callAtomic -> reatomic -> ...
    // recursive callAtomic -> reatomic calls
    function callAtomic() public nonReentrant trackReentrancy {
        IMockReetrancyLogic(address(this)).reatomic();
    }

    function reatomic() override public nonReentrant trackReentrancy {
        callAtomic();
    }

    // one shot atomic call
    function singleAtomic() override public nonReentrant trackReentrancy {
        return;
    }

    // singleAtomicIntra -> singleIntra
    // one shot call to singleIntra initiated by singleAtomicIntra
    function singleAtomicIntra() override public nonReentrant {
        IMockReetrancyLogic(address(this)).singleIntra();
    }

    // singleAtomicStrict -> singleStrict
    // one shot call to singleStrict initiated by singleAtomicStrict
    function singleAtomicStrict(address target) override public externalNonReentrant {
        IMockReetrancyLogic(target).singleStrict();
    }


    /**
     *  externalNonReentrant functions
     *  Any function modified with `externalNonReentrant` should not be able to be called if
     *  another has been called in the same callstack by an external source
     */
    
    // intra -> intra -> intra -> ...
    // recursive intra calls
    function intra() override public externalNonReentrant trackReentrancy {
        IMockReetrancyLogic(address(this)).intra();
    }

    // reIntra(target) -> reIntra(internal) -> reIntra(target) -> ...
    // recursive reIntra calls between this contract and another target contract
    function reIntra(address target) override public externalNonReentrant trackReentrancy {
        IMockReetrancyLogic(target).reIntra(address(this));
    }

    // one shot intra call
    function singleIntra() override public externalNonReentrant trackReentrancy {
        return;
    }

    // reSingleIntra -> singleIntra
    // one shot call to singleIntra on another contract initiated by reSingleIntra
    function reSingleIntra(address target) override public externalNonReentrant trackReentrancy {
        IMockReetrancyLogic(target).singleIntra();
    }

    // singleIntraAtomic -> singleAtomic
    // one shot call to singleAtomic initiated by singleIntraAtomic
    function singleIntraAtomic() override public externalNonReentrant {
        IMockReetrancyLogic(address(this)).singleAtomic();
    }

    // singleIntraStrict -> singleStrict
    // one shot call to singleStrict initiated by singleIntraStrict
    function singleIntraStrict(address target) override public externalNonReentrant {
        IMockReetrancyLogic(target).singleStrict();
    }


    /**
     *  strictNonReentrant functions
     *  Any function modified with `strictNonReentrant` should not be able to be called if
     *  another has been called in the same callstack by any source
     */
    

    // strict -> strict -> strict -> ...
    // recursive strict calls
    function strict() override public strictNonReentrant trackReentrancy {
        IMockReetrancyLogic(address(this)).strict();
    }

    // reStrict(target) -> reStrict(internal) -> reStrict(target) -> ...
    // recursive strict calls
    function reStrict(address target) override public strictNonReentrant trackReentrancy {
        IMockReetrancyLogic(target).reStrict(address(this));
    }

    // strict -> strict -> strict -> ...
    // recursive strict calls
    function singleStrict() override public strictNonReentrant trackReentrancy {
        return;
    }


    /**
     *  Extension interface implementation functions
     *  Any function modified with `strictNonReentrant` should not be able to be called if
     *  another has been called in the same callstack by any source
     */

    function getInterfaceId() override public pure returns(bytes4) {
        return(type(IMockReetrancyLogic).interfaceId);
    }
    
    function getInterface() override public pure returns(string memory) {
        return  "function atomic() external;\n"
                "function reatomic() external;\n"
                "function singleAtomic() external;\n"
                "function singleAtomicIntra() external;\n"
                "function singleAtomicStrict(address target) external;\n"
                "function intra() external;\n"
                "function reIntra(address target) external;\n"
                "function singleIntra() external;\n"
                "function reSingleIntra(address target) external;\n"
                "function singleIntraAtomic() external;\n"
                "function singleIntraStrict(address target) external;\n"
                "function strict() external;\n"
                "function reStrict(address target) external;\n"
                "function singleStrict() external;\n";
    }
}