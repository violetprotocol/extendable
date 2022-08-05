import { expect } from "chai";
import { ethers } from "hardhat";
import { PERMISSIONING } from "../../utils/constants";

export function shouldBehaveLikePermissioning() {
  context("direct", async function () {
    it("initialise permissioning should succeed", async function () {
      await expect(this.permissioning.init()).to.not.be.reverted;
      expect(await this.permissioning.callStatic.getOwner()).to.equal(this.signers.admin.address);
    });

    it("update owner should succeed", async function () {
      await expect(this.permissioning.updateOwner(this.signers.user.address)).to.not.be.reverted;
      expect(await this.permissioning.callStatic.getOwner()).to.equal(this.signers.user.address);
    });

    it("update owner should fail", async function () {
      await expect(this.permissioning.updateOwner(this.signers.admin.address)).to.be.revertedWith("unauthorised");
      expect(await this.permissioning.callStatic.getOwner()).to.equal(this.signers.user.address);
    });

    it("update owner to original owner should succeed", async function () {
      await expect(
        this.permissioning.connect(this.signers.user).updateOwner(this.signers.admin.address),
      ).to.not.be.reverted;
      expect(await this.permissioning.callStatic.getOwner()).to.equal(this.signers.admin.address);
    });

    it("should register interface id during constructor correctly", async function () {
      const extensionAsEIP165 = await ethers.getContractAt("ERC165Logic", this.permissioning.address);
      expect(await extensionAsEIP165.callStatic.supportsInterface(PERMISSIONING.interface)).to.be.true;
    });

    it("should return implemented interfaces correctly", async function () {
      expect(await this.permissioning.callStatic.getInterface()).to.deep.equal([
        [PERMISSIONING.interface, PERMISSIONING.selectors],
      ]);
    });

    it("should return implemented functions correctly", async function () {
      expect(await this.permissioning.callStatic.getSolidityInterface()).to.equal(
        "".concat(
          "function init() external;\n",
          "function updateOwner(address newOwner) external;\n",
          "function getOwner() external view returns(address);\n",
        ),
      );
    });
  });

  context("delegated", async function () {
    it("initialise permissioning should succeed", async function () {
      await expect(this.permissioningCaller.init()).to.not.be.reverted;
      expect(await this.permissioningCaller.callStatic.getOwner()).to.equal(this.signers.admin.address);
    });

    it("update owner should succeed", async function () {
      await expect(this.permissioningCaller.updateOwner(this.signers.user.address)).to.not.be.reverted;
      expect(await this.permissioningCaller.callStatic.getOwner()).to.equal(this.signers.user.address);
    });

    it("update owner should fail", async function () {
      await expect(this.permissioningCaller.updateOwner(this.signers.admin.address)).to.be.revertedWith("unauthorised");
      expect(await this.permissioningCaller.callStatic.getOwner()).to.equal(this.signers.user.address);
    });

    it("update owner to original owner should succeed", async function () {
      await expect(
        this.permissioningCaller.connect(this.signers.user).updateOwner(this.signers.admin.address),
      ).to.not.be.reverted;
      expect(await this.permissioningCaller.callStatic.getOwner()).to.equal(this.signers.admin.address);
    });
  });
}
