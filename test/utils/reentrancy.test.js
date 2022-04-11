const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils")
const { 
    EXTEND_LOGIC_INTERFACE,
    MOCK_REENTRANCY_INTERFACE
} = require("./constants")
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Re-entrancy Guard", function () {
    let account;
    let extendableInternal, extendableExternal;

    let extendLogic;
    let reentrancylogic;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const Extendable = await ethers.getContractFactory("Extendable");
        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const MockReentrancyLogic = await ethers.getContractFactory("MockReentrancyLogic");

        extendLogic = await ExtendLogic.deploy();
        reentrancylogic = await MockReentrancyLogic.deploy();

        await extendLogic.deployed();
        await reentrancylogic.deployed();

        extendableInternal = await Extendable.deploy(extendLogic.address);
        extendableExternal = await Extendable.deploy(extendLogic.address);
        await extendableInternal.deployed();
        await extendableExternal.deployed();
    })

    it("deployed extendable should succeed in initialising", async function () {
        await utils.shouldInitialiseExtendableCorrectly(extendableInternal.address, extendLogic.address);
        await utils.shouldInitialiseExtendableCorrectly(extendableExternal.address, extendLogic.address);
    });

    describe("extend", () => {
        it("should extend extendable with guarded extension", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableInternal.address, "ExtendLogic");
            await expect(extendableEx.extend(reentrancylogic.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, MOCK_REENTRANCY_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, reentrancylogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function atomic(address target) external;\n",
                    "function reatomic(address target) external;\n",
                    "function singleAtomic() external;\n",
                    "function singleReatomic(address target) external;\n",
                    "function singleAtomicIntra(address target) external;\n",
                    "function singleAtomicStrict(address target) external;\n",
                    "function doubleReatomic(address target) external;\n",
                    "function doubleAtomicIntra(address target) external;\n",
                    "function doubleAtomicStrict(address target) external;\n",
                    "function intra(address target) external;\n",
                    "function reIntra(address target) external;\n",
                    "function singleIntra() external;\n",
                    "function singleReIntra(address target) external;\n",
                    "function singleIntraAtomic(address target) external;\n",
                    "function singleIntraStrict(address target) external;\n",
                    "function doubleReIntra(address target) external;\n",
                    "function doubleIntraAtomic(address target) external;\n",
                    "function doubleIntraStrict(address target) external;\n",
                    "function strict(address target) external;\n",
                    "function reStrict(address target) external;\n",
                    "function singleStrict() external;\n",
                    "function singleReStrict(address target) external;\n",
                    "function singleStrictAtomic(address target) external;\n",
                    "function singleStrictIntra(address target) external;\n",
                    "function doubleReStrict(address target) external;\n",
                    "function doubleStrictAtomic(address target) external;\n",
                    "function doubleStrictIntra(address target) external;\n",
                "}"
            ));
        })

        it("should extend external extendable with guarded extension", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableExternal.address, "ExtendLogic");
            await expect(extendableEx.extend(reentrancylogic.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, MOCK_REENTRANCY_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, reentrancylogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function atomic(address target) external;\n",
                    "function reatomic(address target) external;\n",
                    "function singleAtomic() external;\n",
                    "function singleReatomic(address target) external;\n",
                    "function singleAtomicIntra(address target) external;\n",
                    "function singleAtomicStrict(address target) external;\n",
                    "function doubleReatomic(address target) external;\n",
                    "function doubleAtomicIntra(address target) external;\n",
                    "function doubleAtomicStrict(address target) external;\n",
                    "function intra(address target) external;\n",
                    "function reIntra(address target) external;\n",
                    "function singleIntra() external;\n",
                    "function singleReIntra(address target) external;\n",
                    "function singleIntraAtomic(address target) external;\n",
                    "function singleIntraStrict(address target) external;\n",
                    "function doubleReIntra(address target) external;\n",
                    "function doubleIntraAtomic(address target) external;\n",
                    "function doubleIntraStrict(address target) external;\n",
                    "function strict(address target) external;\n",
                    "function reStrict(address target) external;\n",
                    "function singleStrict() external;\n",
                    "function singleReStrict(address target) external;\n",
                    "function singleStrictAtomic(address target) external;\n",
                    "function singleStrictIntra(address target) external;\n",
                    "function doubleReStrict(address target) external;\n",
                    "function doubleStrictAtomic(address target) external;\n",
                    "function doubleStrictIntra(address target) external;\n",
                "}"
            ));
        })
    })

    describe("reentrancy", async () => {
        let exInternal;
        let exExternal;
        
        before("instantiate", async function () {
            exInternal = await utils.getExtendedContractWithInterface(extendableInternal.address, "MockReentrancyLogic");
            exExternal = await utils.getExtendedContractWithInterface(extendableExternal.address, "MockReentrancyLogic");
        })

        // Terminology:
        // Alternate      - Means function calls and their subsequent calls alternate between the original target contract
        //                  and another target contract
        //
        // Internal       - Means function calls and the subsequent calls always target the original contract called
        //
        // Single call    - Means a single function call to a terminating executing function
        //
        // Double call    - Means two function calls to a terminating executing function
        //
        // Recursive      - Means a call to a function that does not terminate through sequential self-referential calls


        describe("atomic reentrancy", async function () {
            it("single call should succeed", async function () {
                await expect(exInternal.singleAtomic()).to.not.be.reverted;
            })

            describe("alternating", async function () {
                it("recursive call should fail", async function () {
                    await expect(exInternal.atomic(exExternal.address)).to.be.revertedWith("nonReentrant: atomic re-entrancy disallowed");
                })

                it("nested recursive call should fail", async function () {
                    await expect(exInternal.reatomic(exExternal.address)).to.be.revertedWith("nonReentrant: atomic re-entrancy disallowed");
                })

                it("single call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.singleReatomic(exExternal.address)).to.not.be.reverted;
                })

                it("single call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.singleAtomicIntra(exExternal.address)).to.not.be.reverted;
                })
            
                it("single call to strictNonReentrant function should fail", async function () {
                    await expect(exInternal.singleAtomicStrict(exExternal.address)).to.not.be.reverted;
                })
    
                it("double call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleReatomic(exExternal.address)).to.not.be.reverted;
                })
    
                it("double call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleAtomicIntra(exExternal.address)).to.be.revertedWith("externalNonReentrant: only intra calls allowed");
                })
    
                it("double call to strictNonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleAtomicStrict(exExternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
            })

            describe("internal", async function() {
                it("recursive call should fail", async function () {
                    await expect(exInternal.atomic(exInternal.address)).to.be.revertedWith("nonReentrant: atomic re-entrancy disallowed");
                })

                it("nested recursive call should fail", async function () {
                    await expect(exInternal.reatomic(exInternal.address)).to.be.revertedWith("nonReentrant: atomic re-entrancy disallowed");
                })
                
                it("single call should succeed", async function () {
                    await expect(exInternal.singleReatomic(exInternal.address)).to.not.be.reverted;
                })

                it("single call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.singleAtomicIntra(exInternal.address)).to.not.be.reverted;
                })
            
                it("single call to strictNonReentrant function should succeed", async function () {
                    await expect(exInternal.singleAtomicStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("double call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleReatomic(exInternal.address)).to.not.be.reverted;
                })
    
                it("double call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleAtomicIntra(exInternal.address)).to.not.be.reverted;
                })
    
                it("double call to strictNonReentrant function should fail", async function () {
                    await expect(exInternal.doubleAtomicStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
            })
        })

        describe("external reentrancy", async function () {
            it("single call should succeed", async function () {
                await expect(exInternal.singleIntra()).to.not.be.reverted;
            })

            describe("alternating", async function() {
                it("recursive call should fail", async function () {
                    await expect(exInternal.intra(exExternal.address)).to.be.revertedWith("externalNonReentrant: only intra calls allowed");
                })
    
                it("nested recursive call should fail", async function () {
                    await expect(exInternal.reIntra(exExternal.address)).to.be.revertedWith("externalNonReentrant: only intra calls allowed");
                })
    
                it("single call should succeed", async function () {
                    await expect(exInternal.singleReIntra(exExternal.address)).to.not.be.reverted;
                })

                it("single call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.singleIntraAtomic(exExternal.address)).to.not.be.reverted;
                })
    
                it("single call to strictNonReentrant function should succeed", async function () {
                    await expect(exInternal.singleIntraStrict(exExternal.address)).to.not.be.reverted;
                })
    
                it("double call should fail", async function () {
                    await expect(exInternal.doubleReIntra(exExternal.address)).to.be.revertedWith("externalNonReentrant: only intra calls allowed");
                })

                it("double call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleIntraAtomic(exExternal.address)).to.not.be.reverted;
                })
    
                it("double call to strictNonReentrant function should fail", async function () {
                    await expect(exInternal.doubleIntraStrict(exExternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
            })

            describe("internal", async function() {
                it("recursive call should succeed", async function () {
                    // Would be better to catch reversion due to out-of-gas
                    await expect(exInternal.intra(exInternal.address)).to.be.revertedWith("successful infinite recursion");
                })
    
                it("nested recursive call should succeed", async function () {
                    // Would be better to catch reversion due to out-of-gas
                    await expect(exInternal.reIntra(exInternal.address)).to.be.revertedWith("successful infinite recursion");
                })
    
                it("single call should succeed", async function () {
                    await expect(exInternal.singleReIntra(exInternal.address)).to.not.be.reverted;
                })

                it("single call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.singleIntraAtomic(exInternal.address)).to.not.be.reverted;
                })
    
                it("single call to strictNonReentrant function should fail", async function () {
                    await expect(exInternal.singleIntraStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("double call should succeed", async function () {
                    await expect(exInternal.doubleReIntra(exInternal.address)).to.not.be.reverted;
                })

                it("double call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleIntraAtomic(exInternal.address)).to.not.be.reverted;
                })
    
                it("double call to strictNonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleIntraStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
            })
        })

        describe("absolute reentrancy", async function () {
            it("single call should succeed", async function () {
                await expect(exInternal.singleStrict()).to.not.be.reverted;
            })

            describe("alternating", async function() {
                it("recursive call should fail", async function () {
                    await expect(exInternal.strict(exExternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("nested recursive call should fail", async function () {
                    await expect(exInternal.reStrict(exExternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("single call should succeed", async function () {
                    await expect(exInternal.singleReStrict(exExternal.address)).to.not.be.reverted;
                })

                it("single call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.singleStrictAtomic(exExternal.address)).to.not.be.reverted;
                })
    
                it("single call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.singleStrictIntra(exExternal.address)).to.not.be.reverted;
                })
    
                it("double call should fail", async function () {
                    await expect(exInternal.doubleReStrict(exExternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })

                it("double call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleStrictAtomic(exExternal.address)).to.not.be.reverted;
                })
    
                it("double call to externalNonReentrant function should fail", async function () {
                    await expect(exInternal.doubleStrictIntra(exExternal.address)).to.be.revertedWith("externalNonReentrant: only intra calls allowed");
                })
            })

            describe("internal", async function() {
                it("recursive call should fail", async function () {
                    await expect(exInternal.strict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("nested recursive call should fail", async function () {
                    await expect(exInternal.reStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("single call should fail", async function () {
                    await expect(exInternal.singleReStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })

                it("single call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.singleStrictAtomic(exInternal.address)).to.not.be.reverted;
                })
    
                it("single call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.singleStrictIntra(exInternal.address)).to.not.be.reverted;
                })
    
                it("double call should succeed", async function () {
                    await expect(exInternal.doubleReStrict(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })

                it("double call to nonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleStrictAtomic(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
    
                it("double call to externalNonReentrant function should succeed", async function () {
                    await expect(exInternal.doubleStrictIntra(exInternal.address)).to.be.revertedWith("strictNonReentrancy: no contract re-entrancy allowed");
                })
            })
        })

    })
});