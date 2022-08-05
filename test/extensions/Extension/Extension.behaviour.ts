import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC165Logic } from "../../../src/types";
import { BASE_EXTENSION_INTERFACE, EIP165_INTERFACE, MOCK_EXTENSION } from "../../utils/constants";

export function shouldBehaveLikeExtension() {
  let extensionAsEIP165: ERC165Logic;

  before(async function () {
    extensionAsEIP165 = <ERC165Logic>await ethers.getContractAt("ERC165Logic", this.mockExtension.address);
  });

  it("call test function should succeed", async function () {
    await expect(this.mockExtensionCaller.callTest(this.mockExtension.address)).to.emit(this.mockExtension, "Test");
  });

  it("call fake function should fail", async function () {
    await expect(this.mockExtensionCaller.callFake(this.mockExtension.address)).to.be.revertedWith(
      "ExtensionNotImplemented",
    );
  });

  it("call reverts should fail normally", async function () {
    await expect(this.mockExtension.reverts()).to.be.revertedWith("normal reversion");
  });

  it("should integrate with EIP-165 correctly", async function () {
    expect(await extensionAsEIP165.callStatic.supportsInterface(EIP165_INTERFACE)).to.be.true;
  });

  it("should implement IExtension correctly", async function () {
    expect(await extensionAsEIP165.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
  });

  it("should register extension interface id during constructor correctly", async function () {
    expect(await extensionAsEIP165.callStatic.supportsInterface(MOCK_EXTENSION.interface)).to.be.true;
    expect(await extensionAsEIP165.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
  });

  it("should return implemented interfaces correctly", async function () {
    expect(await this.mockExtension.callStatic.getInterface()).to.deep.equal([
      [MOCK_EXTENSION.interface, MOCK_EXTENSION.selectors],
    ]);
  });

  it("should return solidity interface correctly", async function () {
    expect(await this.mockExtension.callStatic.getSolidityInterface()).to.equal(
      "".concat("function test() external;\n", "function reverts() external;\n"),
    );
  });
}
