import { waffle } from "hardhat";
import { EXTEND, PERMISSIONING, REPLACE, RETRACT } from "../utils/constants";
import { getExtendedContractWithInterface, shouldInitialiseExtendableCorrectly } from "../utils/utils";
import chai from "chai";
const { expect } = chai;
const { solidity } = waffle;
chai.use(solidity);

export function shouldBehaveLikeExtendable() {
  it("deploy extendable should succeed in initialising", async function () {
    await shouldInitialiseExtendableCorrectly(this.extendable.address, this.extend.address);
  });

  describe("extend", () => {
    it("extend with permissioning should succeed", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.permissioning.address)).to.not.be.reverted;
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        PERMISSIONING.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...PERMISSIONING.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.permissioning.address,
      ]);

      const extendablePermissioningLogic = await getExtendedContractWithInterface(
        this.extendable.address,
        "PermissioningLogic",
      );
      expect(await extendablePermissioningLogic.callStatic.getOwner()).to.equal(this.signers.admin.address);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function init() external;\n",
          "function updateOwner(address newOwner) external;\n",
          "function getOwner() external view returns(address);\n",
          "}",
        ),
      );
    });

    it("extend with retract should succeed", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.retract.address)).to.not.be.reverted;

      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        PERMISSIONING.interface,
        RETRACT.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...PERMISSIONING.selectors,
        ...RETRACT.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.permissioning.address,
        this.retract.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function init() external;\n",
          "function updateOwner(address newOwner) external;\n",
          "function getOwner() external view returns(address);\n",
          "function retract(address extension) external;\n",
          "}",
        ),
      );
    });

    it("extend with replace should succeed", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.replace.address)).to.not.be.reverted;

      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        PERMISSIONING.interface,
        RETRACT.interface,
        REPLACE.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...PERMISSIONING.selectors,
        ...RETRACT.selectors,
        ...REPLACE.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.permissioning.address,
        this.retract.address,
        this.replace.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function init() external;\n",
          "function updateOwner(address newOwner) external;\n",
          "function getOwner() external view returns(address);\n",
          "function retract(address extension) external;\n",
          "function replace(address oldExtension, address newExtension) external;\n",
          "}",
        ),
      );
    });
  });

  describe("retract", () => {
    it("retract with retract should succeed", async function () {
      const extendableRet = await getExtendedContractWithInterface(this.extendable.address, "RetractLogic");
      await expect(extendableRet.retract(this.retract.address)).to.not.be.reverted;

      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        PERMISSIONING.interface,
        REPLACE.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...PERMISSIONING.selectors,
        ...REPLACE.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.permissioning.address,
        this.replace.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function init() external;\n",
          "function updateOwner(address newOwner) external;\n",
          "function getOwner() external view returns(address);\n",
          "function replace(address oldExtension, address newExtension) external;\n",
          "}",
        ),
      );
    });

    it("extend with retract again should succeed", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.retract.address)).to.not.be.reverted;

      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        PERMISSIONING.interface,
        REPLACE.interface,
        RETRACT.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...PERMISSIONING.selectors,
        ...REPLACE.selectors,
        ...RETRACT.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.permissioning.address,
        this.replace.address,
        this.retract.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function init() external;\n",
          "function updateOwner(address newOwner) external;\n",
          "function getOwner() external view returns(address);\n",
          "function replace(address oldExtension, address newExtension) external;\n",
          "function retract(address extension) external;\n",
          "}",
        ),
      );
    });
  });

  describe("replace", () => {
    describe("simple replace", () => {
      it("replace with new retract logic should succeed", async function () {
        const extendableReplaceLogic = await getExtendedContractWithInterface(this.extendable.address, "ReplaceLogic");
        await expect(extendableReplaceLogic.replace(this.retract.address, this.newRetract.address)).to.not.be.reverted;

        const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
        expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
          EXTEND.interface,
          PERMISSIONING.interface,
          REPLACE.interface,
          RETRACT.interface,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
          ...EXTEND.selectors,
          ...PERMISSIONING.selectors,
          ...REPLACE.selectors,
          ...RETRACT.selectors,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
          this.extend.address,
          this.permissioning.address,
          this.replace.address,
          this.newRetract.address,
        ]);
        expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
          "".concat(
            "interface IExtended {\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
            "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "function init() external;\n",
            "function updateOwner(address newOwner) external;\n",
            "function getOwner() external view returns(address);\n",
            "function replace(address oldExtension, address newExtension) external;\n",
            "function retract(address extension) external;\n",
            "}",
          ),
        );
      });

      it("replace with new extend logic should succeed", async function () {
        const extendableReplaceLogic = await getExtendedContractWithInterface(this.extendable.address, "ReplaceLogic");
        await expect(extendableReplaceLogic.replace(this.extend.address, this.newExtend.address)).to.not.be.reverted;

        const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
        expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
          RETRACT.interface,
          PERMISSIONING.interface,
          REPLACE.interface,
          EXTEND.interface,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
          ...RETRACT.selectors,
          ...PERMISSIONING.selectors,
          ...REPLACE.selectors,
          ...EXTEND.selectors,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
          this.newRetract.address,
          this.permissioning.address,
          this.replace.address,
          this.newExtend.address,
        ]);
        expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
          "".concat(
            "interface IExtended {\n",
            "function retract(address extension) external;\n",
            "function init() external;\n",
            "function updateOwner(address newOwner) external;\n",
            "function getOwner() external view returns(address);\n",
            "function replace(address oldExtension, address newExtension) external;\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
            "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "}",
          ),
        );
      });
    });

    describe("strict replace", () => {
      it("strict replace with new extend logic should succeed", async function () {
        const extendableReplaceLogic = await getExtendedContractWithInterface(this.extendable.address, "ReplaceLogic");
        await expect(extendableReplaceLogic.replace(this.replace.address, this.strictReplace.address)).to.not.be
          .reverted;
        await expect(extendableReplaceLogic.replace(this.newExtend.address, this.extend.address)).to.not.be.reverted;

        const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
        expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
          RETRACT.interface,
          PERMISSIONING.interface,
          REPLACE.interface,
          EXTEND.interface,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
          ...RETRACT.selectors,
          ...PERMISSIONING.selectors,
          ...REPLACE.selectors,
          ...EXTEND.selectors,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
          this.newRetract.address,
          this.permissioning.address,
          this.strictReplace.address,
          this.extend.address,
        ]);
        expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
          "".concat(
            "interface IExtended {\n",
            "function retract(address extension) external;\n",
            "function init() external;\n",
            "function updateOwner(address newOwner) external;\n",
            "function getOwner() external view returns(address);\n",
            "function replace(address oldExtension, address newExtension) external;\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
            "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "}",
          ),
        );
      });

      it("strict replace with new replace logic should succeed", async function () {
        const extendableReplaceLogic = await getExtendedContractWithInterface(this.extendable.address, "ReplaceLogic");
        await expect(extendableReplaceLogic.replace(this.strictReplace.address, this.replace.address)).to.not.be
          .reverted;

        const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
        expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
          RETRACT.interface,
          PERMISSIONING.interface,
          EXTEND.interface,
          REPLACE.interface,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
          ...RETRACT.selectors,
          ...PERMISSIONING.selectors,
          ...EXTEND.selectors,
          ...REPLACE.selectors,
        ]);
        expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
          this.newRetract.address,
          this.permissioning.address,
          this.extend.address,
          this.replace.address,
        ]);
        expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
          "".concat(
            "interface IExtended {\n",
            "function retract(address extension) external;\n",
            "function init() external;\n",
            "function updateOwner(address newOwner) external;\n",
            "function getOwner() external view returns(address);\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
            "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "function replace(address oldExtension, address newExtension) external;\n",
            "}",
          ),
        );
      });
    });
  });
}
