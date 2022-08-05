import { expect } from "chai";

export function shouldBehaveLikeERC165() {
  const interfaceId = "0x80ac58cd";
  const invalidInterface = "0xffffffff";

  context("delegated", async function () {
    it("Register interface should register correctly", async function () {
      await expect(this.erc165Caller.callRegisterInterface(interfaceId)).to.not.be.reverted;
      expect(await this.erc165Caller.callStatic.callSupportsInterface(interfaceId)).to.be.true;
    });

    it("Register invalid interface should fail", async function () {
      await expect(this.erc165Caller.callRegisterInterface(invalidInterface)).to.be.revertedWith(
        "ERC165: invalid interface id",
      );
      expect(await this.erc165Caller.callStatic.callSupportsInterface(invalidInterface)).to.be.false;
    });
  });

  context("direct", async function () {
    it("Register interface should fail", async function () {
      await expect(this.erc165.registerInterface(interfaceId)).to.be.revertedWith(
        "ERC165Logic: undelegated calls disallowed",
      );
      await expect(this.erc165.supportsInterface(interfaceId)).to.be.revertedWith(
        "ERC165Logic: undelegated calls disallowed",
      );
    });
  });
}
