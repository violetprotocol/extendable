import { expect } from "chai";
import { ethers } from "hardhat";
import { EXTEND } from "../../utils/constants";

export function shouldBehaveLikeExtend() {
  it("deployment should have initialised owner", async function () {
    expect(await this.extendCaller.callStatic.getOwner(this.permissioning.address)).to.equal(
      this.signers.admin.address,
    );
  });

  it("should register interface id during constructor correctly", async function () {
    const extensionAsEIP165 = await ethers.getContractAt("ERC165Logic", this.extend.address);
    expect(await extensionAsEIP165.callStatic.supportsInterface(EXTEND.interface)).to.be.true;
  });

  it("should return implemented interfaces correctly", async function () {
    expect(await this.extend.callStatic.getInterface()).to.deep.equal([[EXTEND.interface, EXTEND.selectors]]);
  });

  it("should return implemented interfaces correctly", async function () {
    expect(await this.extend.callStatic.getSolidityInterface()).to.equal(
      "".concat(
        "function extend(address extension) external;\n",
        "function getCurrentInterface() external view returns(string memory);\n",
        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
        "function getExtensionAddresses() external view returns(address[] memory);\n",
      ),
    );
  });

  it("extend should succeed", async function () {
    await expect(this.extendCaller.callExtend(this.extend.address)).to.not.be.reverted;
    expect(await this.extendCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.interface]);
    expect(await this.extendCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.selectors);
    expect(await this.extendCaller.callStatic.getExtensionAddresses()).to.deep.equal([this.extend.address]);
    expect(await this.extendCaller.callStatic.getCurrentInterface()).to.equal(
      "".concat(
        "interface IExtended {\n",
        "function extend(address extension) external;\n",
        "function getCurrentInterface() external view returns(string memory);\n",
        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
        "function getExtensionAddresses() external view returns(address[] memory);\n",
        "}",
      ),
    );
  });

  it("extend should fail with non-contract address", async function () {
    await expect(this.extendCaller.callExtend(this.signers.admin.address)).to.be.revertedWith(
      "Extend: address is not a contract",
    );
    expect(await this.extendCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.interface]);
    expect(await this.extendCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.selectors);
    expect(await this.extendCaller.callStatic.getExtensionAddresses()).to.deep.equal([this.extend.address]);
  });

  it("extend should fail with non-owner caller", async function () {
    await expect(this.extendCaller.connect(this.signers.admin).callExtend(this.extend.address)).to.be.revertedWith(
      "unauthorised",
    );
    expect(await this.extendCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.interface]);
    expect(await this.extendCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.selectors);
    expect(await this.extendCaller.callStatic.getExtensionAddresses()).to.deep.equal([this.extend.address]);
  });

  it("extend should fail with non-owner caller", async function () {
    await expect(this.extendCaller.connect(this.signers.admin).callExtend(this.extend.address)).to.be.revertedWith(
      "unauthorised",
    );
    expect(await this.extendCaller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.interface]);
    expect(await this.extendCaller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.selectors);
    expect(await this.extendCaller.callStatic.getExtensionAddresses()).to.deep.equal([this.extend.address]);
  });

  it("extend should fail with already extended interfaceId", async function () {
    await expect(this.extendCaller.callExtend(this.extend.address)).to.be.revertedWith(
      `Extend: interface ${EXTEND.interface} is already implemented by ${this.extend.address.toLowerCase()}`,
    );
    await expect(this.extendCaller.callExtend(this.mockExtend.address)).to.be.revertedWith(
      `Extend: interface ${EXTEND.interface} is already implemented by ${this.extend.address.toLowerCase()}`,
    );
  });

  it("extend should fail with already extended function", async function () {
    await expect(this.extendCaller.callExtend(this.mockAlternative.address)).to.be.revertedWith(
      `Extend: function ${EXTEND.selectors[0]} is already implemented by ${this.extend.address.toLowerCase()}`,
    );
  });
}
