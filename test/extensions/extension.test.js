const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const {
    BASE_EXTENSION_INTERFACE,
    EIP165_INTERFACE,
    MOCK_LOGIC_INTERFACE
} = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Extension", function () {
    let account;
    let extension;
    let caller;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const Extension = await ethers.getContractFactory("MockExtension");
        const Caller = await ethers.getContractFactory("MockExtensionCaller");

        extension = await Extension.deploy();
        caller = await Caller.deploy();

        await extension.deployed();
        await caller.deployed();
    })

    it("call function should succeed", async function () {
        await expect(caller.callTest(extension.address)).to.emit(extension, 'Test');
    });

    it("call function should fail", async function () {
        await expect(caller.callFake(extension.address)).to.be.revertedWith('ExtensionNotImplemented');
    });

    it("call reverts should fail normally", async function () {
        await expect(extension.reverts()).to.be.revertedWith('normal reversion');
    });

    it("should implement EIP-165 correctly", async function () {
        expect(await extension.callStatic.supportsInterface(EIP165_INTERFACE)).to.be.true;
    });

    it("should implement IExtension correctly", async function () {
        expect(await extension.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
    });

    it("should register extension interface id during constructor correctly", async function () {
        expect(await extension.callStatic.supportsInterface(MOCK_LOGIC_INTERFACE)).to.be.true;
        expect(await extension.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
    });

    it("should return interfaceId correctly", async function () {
        expect(await extension.callStatic.getInterfaceId()).to.equal(MOCK_LOGIC_INTERFACE);
    });

    it("should return verbose extension interface correctly", async function () {
        expect(await extension.callStatic.getInterface()).to.equal("".concat(
            "function test() external;\n",
            "function reverts() external;\n"
        ));
    });
});
