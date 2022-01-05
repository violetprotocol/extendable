const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const utils = require("../utils/utils")
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

const EXTEND_LOGIC_INTERFACE = "0xa501cf1f";

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

    it("deployment should have initialised permissioning", async function () {
        expect(await caller.callStatic.getOwner(permissioningLogic.address)).to.equal(account.address);
    });

    it("extend should succeed", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with non-contract address", async function () {
        await expect(caller.callExtend(account.address)).to.be.reverted;
        expect(await caller.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with non-owner caller", async function () {
        await expect(caller.connect(account2).callExtend(extendLogic.address)).to.be.reverted;
        expect(await caller.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
    });

    it("extend should fail with same extension", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.be.revertedWith("");
    });
});
