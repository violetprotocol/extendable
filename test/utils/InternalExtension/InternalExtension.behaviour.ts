import { expect } from "chai";
import { EXTEND, MOCK_INTERNAL_EXTENSION } from "../constants";
import { getExtendedContractWithInterface, shouldInitialiseExtendableCorrectly } from "../utils";

export function shouldBehaveLikeInternalExtension() {
  it("deploy extendable should succeed in initialising", async function () {
    await shouldInitialiseExtendableCorrectly(this.extendable.address, this.extend.address);
  });

  describe("extend", () => {
    it("should extend with internal extension", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.internalExtension.address)).to.not.be.reverted;
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        MOCK_INTERNAL_EXTENSION.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...MOCK_INTERNAL_EXTENSION.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.internalExtension.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function callInternalFunction() external;\n",
          "function internalFunction() external;\n",
          "}",
        ),
      );
    });
  });

  describe("internal function call", async () => {
    it("call external function successfully should succeed", async function () {
      const extendableInternalExtension = await getExtendedContractWithInterface(
        this.extendable.address,
        "MockInternalExtension",
      );
      await expect(extendableInternalExtension.callInternalFunction()).to.not.be.reverted;
    });

    it("call internal function directly should fail", async function () {
      const extendableInternalExtension = await getExtendedContractWithInterface(
        this.extendable.address,
        "MockInternalExtension",
      );
      await expect(extendableInternalExtension.internalFunction()).to.be.revertedWith("external caller not allowed");
    });
  });
}
