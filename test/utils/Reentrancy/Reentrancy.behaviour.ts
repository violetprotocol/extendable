import { expect } from "chai";
import { MockReentrancyLogic } from "../../../src/types";
import { EXTEND, MOCK_REENTRANCY } from "../constants";
import { getExtendedContractWithInterface, shouldInitialiseExtendableCorrectly } from "../utils";

export function shouldBehaveLikeReetrancyGuard() {
  it("deployed extendable should succeed in initialising", async function () {
    await shouldInitialiseExtendableCorrectly(this.extendableInternal.address, this.extend.address);
    await shouldInitialiseExtendableCorrectly(this.extendableExternal.address, this.extend.address);
  });

  describe("extend", () => {
    it("should extend extendable with guarded extension", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(
        this.extendableInternal.address,
        "ExtendLogic",
      );
      await expect(extendableExtendLogic.extend(this.reentrancy.address)).to.not.be.reverted;
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        MOCK_REENTRANCY.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...MOCK_REENTRANCY.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.reentrancy.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
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
          "}",
        ),
      );
    });

    it("should extend external extendable with guarded extension", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(
        this.extendableExternal.address,
        "ExtendLogic",
      );
      await expect(extendableExtendLogic.extend(this.reentrancy.address)).to.not.be.reverted;
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        MOCK_REENTRANCY.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...MOCK_REENTRANCY.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.reentrancy.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
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
          "}",
        ),
      );
    });
  });

  describe("reentrancy", async () => {
    let internalReentrant: MockReentrancyLogic;
    let externalReentrant: MockReentrancyLogic;

    before("instantiate", async function () {
      internalReentrant = <MockReentrancyLogic>(
        await getExtendedContractWithInterface(this.extendableInternal.address, "MockReentrancyLogic")
      );
      externalReentrant = <MockReentrancyLogic>(
        await getExtendedContractWithInterface(this.extendableExternal.address, "MockReentrancyLogic")
      );
    });

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
        await expect(internalReentrant.singleAtomic()).to.not.be.reverted;
      });

      describe("alternating", async function () {
        it("recursive call should fail", async function () {
          await expect(internalReentrant.atomic(externalReentrant.address)).to.be.revertedWith(
            "nonReentrant: atomic re-entrancy disallowed",
          );
        });

        it("nested recursive call should fail", async function () {
          await expect(internalReentrant.reatomic(externalReentrant.address)).to.be.revertedWith(
            "nonReentrant: atomic re-entrancy disallowed",
          );
        });

        it("single call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleReatomic(externalReentrant.address)).to.not.be.reverted;
        });

        it("single call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleAtomicIntra(externalReentrant.address)).to.not.be.reverted;
        });

        it("single call to strictNonReentrant function should fail", async function () {
          await expect(internalReentrant.singleAtomicStrict(externalReentrant.address)).to.not.be.reverted;
        });

        it("double call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleReatomic(externalReentrant.address)).to.not.be.reverted;
        });

        it("double call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleAtomicIntra(externalReentrant.address)).to.be.revertedWith(
            "externalNonReentrant: only intra calls allowed",
          );
        });

        it("double call to strictNonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleAtomicStrict(externalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });
      });

      describe("internal", async function () {
        it("recursive call should fail", async function () {
          await expect(internalReentrant.atomic(internalReentrant.address)).to.be.revertedWith(
            "nonReentrant: atomic re-entrancy disallowed",
          );
        });

        it("nested recursive call should fail", async function () {
          await expect(internalReentrant.reatomic(internalReentrant.address)).to.be.revertedWith(
            "nonReentrant: atomic re-entrancy disallowed",
          );
        });

        it("single call should succeed", async function () {
          await expect(internalReentrant.singleReatomic(internalReentrant.address)).to.not.be.reverted;
        });

        it("single call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleAtomicIntra(internalReentrant.address)).to.not.be.reverted;
        });

        it("single call to strictNonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleAtomicStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("double call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleReatomic(internalReentrant.address)).to.not.be.reverted;
        });

        it("double call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleAtomicIntra(internalReentrant.address)).to.not.be.reverted;
        });

        it("double call to strictNonReentrant function should fail", async function () {
          await expect(internalReentrant.doubleAtomicStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });
      });
    });

    describe("external reentrancy", async function () {
      it("single call should succeed", async function () {
        await expect(internalReentrant.singleIntra()).to.not.be.reverted;
      });

      describe("alternating", async function () {
        it("recursive call should fail", async function () {
          await expect(internalReentrant.intra(externalReentrant.address)).to.be.revertedWith(
            "externalNonReentrant: only intra calls allowed",
          );
        });

        it("nested recursive call should fail", async function () {
          await expect(internalReentrant.reIntra(externalReentrant.address)).to.be.revertedWith(
            "externalNonReentrant: only intra calls allowed",
          );
        });

        it("single call should succeed", async function () {
          await expect(internalReentrant.singleReIntra(externalReentrant.address)).to.not.be.reverted;
        });

        it("single call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleIntraAtomic(externalReentrant.address)).to.not.be.reverted;
        });

        it("single call to strictNonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleIntraStrict(externalReentrant.address)).to.not.be.reverted;
        });

        it("double call should fail", async function () {
          await expect(internalReentrant.doubleReIntra(externalReentrant.address)).to.be.revertedWith(
            "externalNonReentrant: only intra calls allowed",
          );
        });

        it("double call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleIntraAtomic(externalReentrant.address)).to.not.be.reverted;
        });

        it("double call to strictNonReentrant function should fail", async function () {
          await expect(internalReentrant.doubleIntraStrict(externalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });
      });

      describe("internal", async function () {
        it("recursive call should succeed", async function () {
          // Would be better to catch reversion due to out-of-gas
          await expect(internalReentrant.intra(internalReentrant.address)).to.be.revertedWith(
            "successful infinite recursion",
          );
        });

        it("nested recursive call should succeed", async function () {
          // Would be better to catch reversion due to out-of-gas
          await expect(internalReentrant.reIntra(internalReentrant.address)).to.be.revertedWith(
            "successful infinite recursion",
          );
        });

        it("single call should succeed", async function () {
          await expect(internalReentrant.singleReIntra(internalReentrant.address)).to.not.be.reverted;
        });

        it("single call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleIntraAtomic(internalReentrant.address)).to.not.be.reverted;
        });

        it("single call to strictNonReentrant function should fail", async function () {
          await expect(internalReentrant.singleIntraStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("double call should succeed", async function () {
          await expect(internalReentrant.doubleReIntra(internalReentrant.address)).to.not.be.reverted;
        });

        it("double call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleIntraAtomic(internalReentrant.address)).to.not.be.reverted;
        });

        it("double call to strictNonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleIntraStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });
      });
    });

    describe("absolute reentrancy", async function () {
      it("single call should succeed", async function () {
        await expect(internalReentrant.singleStrict()).to.not.be.reverted;
      });

      describe("alternating", async function () {
        it("recursive call should fail", async function () {
          await expect(internalReentrant.strict(externalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("nested recursive call should fail", async function () {
          await expect(internalReentrant.reStrict(externalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("single call should succeed", async function () {
          await expect(internalReentrant.singleReStrict(externalReentrant.address)).to.not.be.reverted;
        });

        it("single call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleStrictAtomic(externalReentrant.address)).to.not.be.reverted;
        });

        it("single call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleStrictIntra(externalReentrant.address)).to.not.be.reverted;
        });

        it("double call should fail", async function () {
          await expect(internalReentrant.doubleReStrict(externalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("double call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleStrictAtomic(externalReentrant.address)).to.not.be.reverted;
        });

        it("double call to externalNonReentrant function should fail", async function () {
          await expect(internalReentrant.doubleStrictIntra(externalReentrant.address)).to.be.revertedWith(
            "externalNonReentrant: only intra calls allowed",
          );
        });
      });

      describe("internal", async function () {
        it("recursive call should fail", async function () {
          await expect(internalReentrant.strict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("nested recursive call should fail", async function () {
          await expect(internalReentrant.reStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("single call should fail", async function () {
          await expect(internalReentrant.singleReStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("single call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleStrictAtomic(internalReentrant.address)).to.not.be.reverted;
        });

        it("single call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.singleStrictIntra(internalReentrant.address)).to.not.be.reverted;
        });

        it("double call should succeed", async function () {
          await expect(internalReentrant.doubleReStrict(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("double call to nonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleStrictAtomic(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });

        it("double call to externalNonReentrant function should succeed", async function () {
          await expect(internalReentrant.doubleStrictIntra(internalReentrant.address)).to.be.revertedWith(
            "strictNonReentrancy: no contract re-entrancy allowed",
          );
        });
      });
    });
  });
}
