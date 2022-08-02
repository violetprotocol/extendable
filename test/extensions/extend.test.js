const { ethers } = require("hardhat");
const chai = require("chai");
const utils = require("../utils/utils")
const { EXTEND } = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect } = chai;

describe("ExtendLogic", function () {
    let account;
    let permissioningLogic;
    let extendLogic;
    let caller;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const PermissioningLogic = await ethers.getContractFactory("PermissioningLogic");
        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const ExtendCaller = await ethers.getContractFactory("ExtendCaller");

        permissioningLogic = await PermissioningLogic.deploy();
        extendLogic = await ExtendLogic.deploy();

        await permissioningLogic.deployed();
        await extendLogic.deployed();

        caller = await ExtendCaller.deploy(permissioningLogic.address, extendLogic.address);
        await caller.deployed();
    })

    it("deployment should have initialised owner", async function () {
        expect(await caller.callStatic.getOwner(permissioningLogic.address)).to.equal(account.address);
    });

    it("should register interface id during constructor correctly", async function () {
        const extensionAsEIP165 = await utils.getExtendedContractWithInterface(extendLogic.address, "ERC165Logic");
        expect(await extensionAsEIP165.callStatic.supportsInterface(EXTEND.INTERFACE)).to.be.true;
    });

    it("should return implemented interfaces correctly", async function () {
        expect(await extendLogic.callStatic.getImplementedInterfaces()).to.deep.equal([EXTEND.INTERFACE]);
    });

    it("should return implemented functions correctly", async function () {
        expect(await extendLogic.callStatic.getFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
    });

    it("extend should succeed", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with non-contract address", async function () {
        await expect(caller.callExtend(account.address)).to.be.revertedWith("Extend: address is not a contract");
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with non-owner caller", async function () {
        await expect(caller.connect(account2).callExtend(extendLogic.address)).to.be.revertedWith("unauthorised");
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with non-owner caller", async function () {
        await expect(caller.connect(account2).callExtend(extendLogic.address)).to.be.revertedWith("unauthorised");
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with same extension", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.be.revertedWith(`Extend: function ${EXTEND.SELECTORS[0]} is already implemented by ${extendLogic.address.toLowerCase()}`);
    });
});
