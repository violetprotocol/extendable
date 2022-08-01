const { ethers } = require("hardhat");
const chai = require("chai");
const {
    BASE_EXTENSION_INTERFACE,
    EIP165_INTERFACE,
    MOCK_LOGIC_INTERFACE
} = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
const { getExtendedContractWithInterface } = require("../utils/utils");
chai.use(solidity);
const { expect } = chai;

describe("Extension", function () {
    let account;
    let extension;
    let caller;
    let extensionAsEIP165;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();
        
        const Extension = await ethers.getContractFactory("MockExtension");
        const Caller = await ethers.getContractFactory("MockExtensionCaller");

        extension = await Extension.deploy();
        caller = await Caller.deploy();

        await extension.deployed();
        await caller.deployed();

        extensionAsEIP165 = await getExtendedContractWithInterface(extension.address, "ERC165Logic");
    })

    it("call test function should succeed", async function () {
        await expect(caller.callTest(extension.address)).to.emit(extension, 'Test');
    });

    it("call fake function should fail", async function () {
        await expect(caller.callFake(extension.address)).to.be.revertedWith('ExtensionNotImplemented');
    });

    it("call reverts should fail normally", async function () {
        await expect(extension.reverts()).to.be.revertedWith('normal reversion');
    });

    it("should integrate with EIP-165 correctly", async function () {
        expect(await extensionAsEIP165.callStatic.supportsInterface(EIP165_INTERFACE)).to.be.true;
    });

    it("should implement IExtension correctly", async function () {
        expect(await extensionAsEIP165.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
    });

    it("should register extension interface id during constructor correctly", async function () {
        expect(await extensionAsEIP165.callStatic.supportsInterface(MOCK_LOGIC_INTERFACE)).to.be.true;
        expect(await extensionAsEIP165.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
    });

    it("should return implemented interfaces correctly", async function () {
        expect(await extension.callStatic.getImplementedInterfaces()).to.deep.equal([MOCK_LOGIC_INTERFACE]);
    });

    it("should return function selectors correctly", async function () {
        expect(await extension.callStatic.getImplementedInterfaces()).to.deep.equal([MOCK_LOGIC_INTERFACE]);
    });

    it("should return verbose extension interface correctly", async function () {
        expect(await extension.callStatic.getInterface()).to.equal("".concat(
            "function test() external;\n",
            "function reverts() external;\n"
        ));
    });
});