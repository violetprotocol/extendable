const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const utils = require("../utils/utils")
const { 
    EXTEND,
    RETRACT,
    REPLACE
} = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("RetractLogic", function () {
    let account;
    let permissioningLogic;
    let extendLogic;
    let retractLogic;
    let replaceLogic;
    let caller;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const PermissioningLogic = await ethers.getContractFactory("PermissioningLogic");
        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const RetractLogic = await ethers.getContractFactory("RetractLogic");
        const ReplaceLogic = await ethers.getContractFactory("ReplaceLogic");
        const RetractCaller = await ethers.getContractFactory("RetractCaller");

        permissioningLogic = await PermissioningLogic.deploy();
        extendLogic = await ExtendLogic.deploy();
        retractLogic = await RetractLogic.deploy();
        replaceLogic = await ReplaceLogic.deploy();

        await permissioningLogic.deployed();
        await extendLogic.deployed();
        await retractLogic.deployed();
        await replaceLogic.deployed();

        caller = await RetractCaller.deploy(permissioningLogic.address, extendLogic.address, retractLogic.address);
        await caller.deployed();
    })

    it("deployment should have initialised permissioning", async function () {
        expect(await caller.callStatic.getOwner(permissioningLogic.address)).to.equal(account.address);
    });

    it("extend should succeed", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend with retract should succeed", async function () {
        await expect(caller.callExtend(retractLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, RETRACT.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...RETRACT.SELECTORS]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, retractLogic.address]);
    });

    it("extend with replace should succeed", async function () {
        await expect(caller.callExtend(replaceLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, RETRACT.INTERFACE, REPLACE.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...RETRACT.SELECTORS, ...REPLACE.SELECTORS]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, retractLogic.address, replaceLogic.address]);
    });

    it("retract should fail with non-owner caller", async function () {
        await expect(caller.connect(account2).callRetract(extendLogic.address)).to.be.revertedWith("unauthorised");
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, RETRACT.INTERFACE, REPLACE.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...RETRACT.SELECTORS, ...REPLACE.SELECTORS]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, retractLogic.address, replaceLogic.address]);
    });

    it("retract with non-existent extension should not change state", async function () {
        await expect(caller.callRetract(account.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, RETRACT.INTERFACE, REPLACE.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...RETRACT.SELECTORS, ...REPLACE.SELECTORS]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, retractLogic.address, replaceLogic.address]);
    });

    it("retract should succeed", async function () {
        await expect(caller.callRetract(extendLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([REPLACE.INTERFACE, RETRACT.INTERFACE]);
        // expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...REPLACE.SELECTORS, ...RETRACT.SELECTORS]);
        // expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([replaceLogic.address, retractLogic.address]);
    });

    it("should register interface id during constructor correctly", async function () {
        const extensionAsEIP165 = await utils.getExtendedContractWithInterface(extendLogic.address, "ERC165Logic");
        expect(await extensionAsEIP165.callStatic.supportsInterface(RETRACT.INTERFACE)).to.be.true;
    });

    it("should return interfaceId correctly", async function () {
        expect(await retractLogic.callStatic.getImplementedInterfaces()).to.deep.equal([RETRACT.INTERFACE]);
    });

    it("should return interfaceId correctly", async function () {
        expect(await retractLogic.callStatic.getFunctionSelectors()).to.deep.equal([RETRACT.SELECTORS]);
    });
});
