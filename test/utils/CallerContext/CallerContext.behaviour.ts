import { expect } from "chai";
import { EXTEND, MOCK_CALLER_CONTEXT, MOCK_DEEP_CALLER_CONTEXT } from "../constants";
import { getExtendedContractWithInterface, shouldInitialiseExtendableCorrectly } from "../utils";

export function shouldBehaveLikeCallerContext() {
  it("deploy extendable should succeed in initialising", async function () {
    await shouldInitialiseExtendableCorrectly(this.extendable.address, this.extend.address);
  });

  describe("extend", () => {
    it("should extend with caller context", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.mockCallerContext.address)).to.not.be.reverted;
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        MOCK_CALLER_CONTEXT.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...MOCK_CALLER_CONTEXT.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.mockCallerContext.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function getCallerStack() external returns(address[] memory);\n",
          "function getCurrentCaller() external returns(address);\n",
          "function getLastExternalCaller() external returns(address);\n",
          "}",
        ),
      );
    });

    it("should extend with deep caller context", async function () {
      const extendableExtendLogic = await getExtendedContractWithInterface(this.extendable.address, "ExtendLogic");
      await expect(extendableExtendLogic.extend(this.mockDeepCallerContext.address)).to.not.be.reverted;
      expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([
        EXTEND.interface,
        MOCK_CALLER_CONTEXT.interface,
        MOCK_DEEP_CALLER_CONTEXT.interface,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([
        ...EXTEND.selectors,
        ...MOCK_CALLER_CONTEXT.selectors,
        ...MOCK_DEEP_CALLER_CONTEXT.selectors,
      ]);
      expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([
        this.extend.address,
        this.mockCallerContext.address,
        this.mockDeepCallerContext.address,
      ]);
      expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal(
        "".concat(
          "interface IExtended {\n",
          "function extend(address extension) external;\n",
          "function getCurrentInterface() external view returns(string memory);\n",
          "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
          "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
          "function getExtensionAddresses() external view returns(address[] memory);\n",
          "function getCallerStack() external returns(address[] memory);\n",
          "function getCurrentCaller() external returns(address);\n",
          "function getLastExternalCaller() external returns(address);\n",
          "function getDeepCallerStack() external returns(address[] memory);\n",
          "function getDeepCurrentCaller() external returns(address);\n",
          "function getDeepLastExternalCaller() external returns(address);\n",
          "}",
        ),
      );
    });
  });

  describe("caller context", async () => {
    it("should record caller stack correctly", async function () {
      const extendableCallerContextLogic = await getExtendedContractWithInterface(
        this.extendable.address,
        "MockCallerContextLogic",
      );
      expect(await extendableCallerContextLogic.callStatic.getCurrentCaller()).to.equal(this.signers.admin.address);
      expect(await extendableCallerContextLogic.callStatic.getLastExternalCaller()).to.equal(
        this.signers.admin.address,
      );

      // callerstack should always be empty by the end of an execution, but the call navigates through a stackpush which places
      // the current caller on the callstack
      expect(await extendableCallerContextLogic.callStatic.getCallerStack()).to.deep.equal([
        this.signers.admin.address,
      ]);
    });

    it("should record deep caller stack correctly", async function () {
      let extendableCallerContextLogic = await getExtendedContractWithInterface(
        this.extendable.address,
        "MockDeepCallerContextLogic",
      );
      expect(await extendableCallerContextLogic.callStatic.getDeepCurrentCaller()).to.equal(this.extendable.address);
      expect(await extendableCallerContextLogic.callStatic.getDeepLastExternalCaller()).to.equal(
        this.signers.admin.address,
      );

      // callerstack should always be empty by the end of an execution, but the call navigates through a stackpush which places
      // the current caller on the callstack, in this case it calls through the EOA and the contract
      expect(await extendableCallerContextLogic.callStatic.getDeepCallerStack()).to.deep.equal([
        this.signers.admin.address,
        this.extendable.address,
      ]);
    });
  });
}
