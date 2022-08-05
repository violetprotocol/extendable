import { expect } from "chai";
import { Contract } from "ethers";
import { ReplaceCaller, ReplaceLogic } from "../../../src/types";
import { EXTEND, PERMISSIONING, REPLACE, RETRACT } from "../../utils/constants";
import { checkExtensions, getExtendedContractWithInterface } from "../../utils/utils";

const SHOULD_NOT_REVERT = false;

export function shouldBehaveLikeReplace() {
  it("deployment should have initialised permissioning", async function () {
    expect(await this.replaceCaller.callStatic.getOwner(this.permissioning.address)).to.equal(
      this.signers.admin.address,
    );
  });

  describe("extend with replace", () => {
    it("extend should succeed", async function () {
      await expect(this.replaceCaller.callExtend(this.extend.address)).to.not.be.reverted;
      await checkExtensions(this.replaceCaller, [EXTEND.interface], [...EXTEND.selectors], [this.extend.address]);
    });

    it("extend with permissioning should succeed", async function () {
      await expect(this.replaceCaller.callExtend(this.permissioning.address)).to.not.be.reverted;
      await checkExtensions(
        this.replaceCaller,
        [EXTEND.interface, PERMISSIONING.interface],
        [...EXTEND.selectors, ...PERMISSIONING.selectors],
        [this.extend.address, this.permissioning.address],
      );
    });

    it("extend with replace should succeed", async function () {
      await expect(this.replaceCaller.callExtend(this.replace.address)).to.not.be.reverted;
      await checkExtensions(
        this.replaceCaller,
        [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
        [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
        [this.extend.address, this.permissioning.address, this.replace.address],
      );
    });
  });

  describe("replace", () => {
    describe("default replace", () => {
      it("should register interface id during constructor correctly", async function () {
        const extensionAsEIP165 = await getExtendedContractWithInterface(this.replace.address, "ERC165Logic");
        expect(await extensionAsEIP165.callStatic.supportsInterface(REPLACE.interface)).to.be.true;
      });

      it("should return implemented interfaces correctly", async function () {
        expect(await this.replace.callStatic.getInterface()).to.deep.equal([[REPLACE.interface, REPLACE.selectors]]);
      });

      it("replace should fail with non-owner caller", async function () {
        await replace(
          this.replaceCaller.connect(this.signers.user),
          this.extend.address,
          this.newExtend.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.extend.address, this.permissioning.address, this.replace.address],
          "unauthorised",
        );
      });

      it("replace should fail with non-existent old extension", async function () {
        await replace(
          this.replaceCaller,
          this.signers.admin.address,
          this.newExtend.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.extend.address, this.permissioning.address, this.replace.address],
          "Retract: specified extension is not an extension of this contract, cannot retract",
        );
      });

      it("replace extend should fail with invalid new extension", async function () {
        await replace(
          this.replaceCaller,
          this.extend.address,
          this.signers.admin.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.extend.address, this.permissioning.address, this.replace.address],
          "Replace: new extend address is not a contract",
        );
      });

      it("replace should fail with invalid new extension", async function () {
        await replace(
          this.replaceCaller,
          this.replace.address,
          this.signers.admin.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.extend.address, this.permissioning.address, this.replace.address],
          "Extend: address is not a contract",
        );
      });

      it("replace should fail with colliding interfaceIds", async function () {
        // Here we are replacing the permissioning logic with a new extend logic that shares an interface with the old extend logic
        // This fails because there cannot exist 2 extensions with the same interface id
        await replace(
          this.replaceCaller,
          this.permissioning.address,
          this.newExtend.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.extend.address, this.permissioning.address, this.replace.address],
          `Extend: interface ${EXTEND.interface} is already implemented by ${this.extend.address.toLowerCase()}`,
        );
      });

      it("replace extend should succeed", async function () {
        await replace(
          this.replaceCaller,
          this.extend.address,
          this.newExtend.address,
          [REPLACE.interface, PERMISSIONING.interface, EXTEND.interface],
          [...REPLACE.selectors, ...PERMISSIONING.selectors, ...EXTEND.selectors],
          [this.replace.address, this.permissioning.address, this.newExtend.address],
          SHOULD_NOT_REVERT,
        );
      });

      it("replace extend with different interface should fail", async function () {
        await replace(
          this.replaceCaller,
          this.newExtend.address,
          this.mockExtend.address,
          [REPLACE.interface, PERMISSIONING.interface, EXTEND.interface],
          [...REPLACE.selectors, ...PERMISSIONING.selectors, ...EXTEND.selectors],
          [this.replace.address, this.permissioning.address, this.newExtend.address],
          "Replace: ExtendLogic interface of new does not match old, please only use identical ExtendLogic interfaces",
        );
      });

      it("replace with strict replace extension should succeed", async function () {
        await replace(
          this.replaceCaller,
          this.replace.address,
          this.strictReplace.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.newExtend.address, this.permissioning.address, this.strictReplace.address],
          SHOULD_NOT_REVERT,
        );
      });
    });

    describe("strict replace", () => {
      it("should register interface id during constructor correctly", async function () {
        const extensionAsEIP165 = await getExtendedContractWithInterface(this.strictReplace.address, "ERC165Logic");
        expect(await extensionAsEIP165.callStatic.supportsInterface(REPLACE.interface)).to.be.true;
      });

      it("should return implemented interfaces correctly", async function () {
        expect(await this.strictReplace.callStatic.getInterface()).to.deep.equal([
          [REPLACE.interface, REPLACE.selectors],
        ]);
      });

      it("strict replace extend should succeed", async function () {
        await replace(
          this.replaceCaller,
          this.newExtend.address,
          this.extend.address,
          [REPLACE.interface, PERMISSIONING.interface, EXTEND.interface],
          [...REPLACE.selectors, ...PERMISSIONING.selectors, ...EXTEND.selectors],
          [this.strictReplace.address, this.permissioning.address, this.extend.address],
          SHOULD_NOT_REVERT,
        );
      });

      it("strict replace with different interface should fail", async function () {
        await replace(
          this.replaceCaller,
          this.strictReplace.address,
          this.mockExtend.address,
          [REPLACE.interface, PERMISSIONING.interface, EXTEND.interface],
          [...REPLACE.selectors, ...PERMISSIONING.selectors, ...EXTEND.selectors],
          [this.strictReplace.address, this.permissioning.address, this.extend.address],
          "Replace: interface of new does not match old, please only use identical interfaces",
        );
      });

      it("strict replace with same interface should succeed", async function () {
        await replace(
          this.replaceCaller,
          this.strictReplace.address,
          this.replace.address,
          [EXTEND.interface, PERMISSIONING.interface, REPLACE.interface],
          [...EXTEND.selectors, ...PERMISSIONING.selectors, ...REPLACE.selectors],
          [this.extend.address, this.permissioning.address, this.replace.address],
          SHOULD_NOT_REVERT,
        );
      });
    });
  });
}

const replace = async (
  caller: ReplaceCaller,
  oldExtension: string,
  newExtension: string,
  expectedInterfaceIds: string[],
  expectedFunctionSelectors: string[],
  expectedContractAddresses: string[],
  revertMessage: string | boolean = false,
) => {
  if (revertMessage !== false && typeof revertMessage !== "boolean")
    await expect(caller.callReplace(oldExtension, newExtension)).to.be.revertedWith(revertMessage);
  else await expect(caller.callReplace(oldExtension, newExtension)).to.not.be.reverted;

  await checkExtensions(caller, expectedInterfaceIds, expectedFunctionSelectors, expectedContractAddresses);
};
