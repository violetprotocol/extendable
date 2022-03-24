const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils")
const { 
    EXTEND_LOGIC_INTERFACE,
    MOCK_CALLER_CONTEXT_INTERFACE,
    MOCK_DEEP_CALLER_CONTEXT_INTERFACE
} = require("./constants")
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Re-entrancy Guard", function () {
    let account;
    let extendable, external;

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

        extendable = await Extendable.deploy(extendLogic.address);
        external = await Extendable.deploy(extendLogic.address);
        await extendable.deployed();
        await external.deployed();
    })

    it("deploy extendable should succeed in initialising", async function () {
        const internalExtendable = await utils.getExtendedContractWithInterface(extendable.address, "ExtendLogic");
        expect(await internalExtendable.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await internalExtendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
        expect(await internalExtendable.callStatic.getCurrentInterface()).to.equal("".concat(
            "interface IExtended {\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensions() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "}"
        ));

        const externalExtendable = await utils.getExtendedContractWithInterface(external.address, "ExtendLogic");
        expect(await externalExtendable.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await externalExtendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
        expect(await externalExtendable.callStatic.getCurrentInterface()).to.equal("".concat(
            "interface IExtended {\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensions() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "}"
        ));
    });

    describe("extend", () => {
        it("should extend extendable with guarded extension", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendable.address, "ExtendLogic");
            await expect(extendableEx.extend(reentrancylogic.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, MOCK_CALLER_CONTEXT_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, reentrancylogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function atomic() external;\n",
                    "function reatomic() external;\n",
                    "function singleAtomic() external;\n",
                    "function singleAtomicIntra() external;\n",
                    "function singleAtomicStrict(address target) external;\n",
                    "function intra() external;\n",
                    "function reIntra(address target) external;\n",
                    "function singleIntra() external;\n",
                    "function reSingleIntra(address target) external;\n",
                    "function singleIntraAtomic() external;\n",
                    "function singleIntraStrict(address target) external;\n",
                    "function strict() external;\n",
                    "function reStrict(address target) external;\n",
                    "function singleStrict() external;\n",
                "}"
            ));
        })

        it("should extend external extendable with guarded extension", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(external.address, "ExtendLogic");
            await expect(extendableEx.extend(reentrancylogic.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, MOCK_CALLER_CONTEXT_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, reentrancylogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function atomic() external;\n",
                    "function reatomic() external;\n",
                    "function singleAtomic() external;\n",
                    "function singleAtomicIntra() external;\n",
                    "function singleAtomicStrict(address target) external;\n",
                    "function intra() external;\n",
                    "function reIntra(address target) external;\n",
                    "function singleIntra() external;\n",
                    "function reSingleIntra(address target) external;\n",
                    "function singleIntraAtomic() external;\n",
                    "function singleIntraStrict(address target) external;\n",
                    "function strict() external;\n",
                    "function reStrict(address target) external;\n",
                    "function singleStrict() external;\n",
                "}"
            ));
        })
    })

    // describe("caller context", async () => {
    //     it("should record caller stack correctly", async function () {
    //         const extendableCC = await utils.getExtendedContractWithInterface(extendableAddress, "MockCallerContextLogic");
    //         expect(await extendableCC.callStatic.getCurrentCaller()).to.equal(account.address);
    //         expect(await extendableCC.callStatic.getLastExternalCaller()).to.equal(account.address);
    //     })

    //     it("should record deep caller stack correctly", async function () {
    //         const extendableCC = await utils.getExtendedContractWithInterface(extendableAddress, "MockDeepCallerContextLogic");
    //         expect(await extendableCC.callStatic.getDeepCurrentCaller()).to.equal(extendableAddress);
    //         expect(await extendableCC.callStatic.getDeepLastExternalCaller()).to.equal(account.address);
    //     })
    // })
});