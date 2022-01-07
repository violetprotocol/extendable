const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const utils = require("../utils/utils")
const { 
    EXTEND_LOGIC_INTERFACE, 
    PERMISSIONING_LOGIC_INTERFACE,
    REPLACE_LOGIC_INTERFACE
} = require("../utils/constants")
// const { solidity } = require("ethereum-waffle");
// chai.use(solidity);
const { expect, assert } = chai;

const SHOULD_NOT_REVERT = false;

describe("ReplaceLogic", function () {
    let account;
    let permissioningLogic;
    let extendLogic;
    let newExtendLogic;
    let mockNewExtendLogic;
    let retractLogic;
    let replaceLogic;
    let alterReplaceLogic;
    let strictReplaceLogic;
    let mockNewReplaceLogic;
    let caller;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const PermissioningLogic = await ethers.getContractFactory("PermissioningLogic");
        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const MockNewExtendLogic = await ethers.getContractFactory("MockNewExtendLogic");
        const RetractLogic = await ethers.getContractFactory("RetractLogic");
        const ReplaceLogic = await ethers.getContractFactory("ReplaceLogic");
        const AlterReplaceLogic = await ethers.getContractFactory("AlterReplaceLogic");
        const StrictReplaceLogic = await ethers.getContractFactory("StrictReplaceLogic");
        const MockNewReplaceLogic = await ethers.getContractFactory("MockNewReplaceLogic");
        const ReplaceCaller = await ethers.getContractFactory("ReplaceCaller");

        permissioningLogic = await PermissioningLogic.deploy();
        extendLogic = await ExtendLogic.deploy();
        newExtendLogic = await ExtendLogic.deploy();
        mockNewExtendLogic = await MockNewExtendLogic.deploy();
        retractLogic = await RetractLogic.deploy();
        replaceLogic = await ReplaceLogic.deploy();
        alterReplaceLogic = await AlterReplaceLogic.deploy();
        strictReplaceLogic = await StrictReplaceLogic.deploy();
        mockNewReplaceLogic = await MockNewReplaceLogic.deploy();

        await permissioningLogic.deployed();
        await extendLogic.deployed();
        await newExtendLogic.deployed();
        await mockNewExtendLogic.deployed();
        await retractLogic.deployed();
        await replaceLogic.deployed();
        await alterReplaceLogic.deployed();
        await strictReplaceLogic.deployed();
        await mockNewReplaceLogic.deployed();

        caller = await ReplaceCaller.deploy(permissioningLogic.address, extendLogic.address, retractLogic.address, replaceLogic.address);
        await caller.deployed();
    })

    it("deployment should have initialised permissioning", async function () {
        expect(await caller.callStatic.getOwner(permissioningLogic.address)).to.equal(account.address);
    });

    describe("extend with replace", () => {
        it("extend should succeed", async function () {
            await expect(caller.callExtend(extendLogic.address)).to.not.be.reverted;
            await utils.checkExtensions(
                caller, 
                [EXTEND_LOGIC_INTERFACE], 
                [extendLogic.address]
            );
        });
    
        it("extend with permissioning should succeed", async function () {
            await expect(caller.callExtend(permissioningLogic.address)).to.not.be.reverted;
            await utils.checkExtensions(
                caller, 
                [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE], 
                [extendLogic.address, permissioningLogic.address]
            );
        });
    
        it("extend with replace should succeed", async function () {
            await expect(caller.callExtend(replaceLogic.address)).to.not.be.reverted;
            await utils.checkExtensions(
                caller, 
                [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                [extendLogic.address, permissioningLogic.address, replaceLogic.address]
            );
        });
    })

    describe("replace", () => {
        describe("simple replace", () => {
            it("replace should fail with non-owner caller", async function () {
                await replace(caller.connect(account2),
                    extendLogic.address, newExtendLogic.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [extendLogic.address, permissioningLogic.address, replaceLogic.address],
                    "unauthorised"
                );
            });
        
            it("replace should fail with non-existent old extension", async function () {
                await replace(caller, 
                    account.address, newExtendLogic.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [extendLogic.address, permissioningLogic.address, replaceLogic.address],
                    "Retract: specified extension is not an extension of this contract, cannot retract"
                );
            });
        
            it("replace extend should fail with invalid new extension", async function () {
                await replace(caller, 
                    extendLogic.address, account.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [extendLogic.address, permissioningLogic.address, replaceLogic.address],
                    "Replace: new extend address is not a contract"
                );
            });
        
            it("replace should fail with invalid new extension", async function () {
                await replace(caller, 
                    replaceLogic.address, account.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [extendLogic.address, permissioningLogic.address, replaceLogic.address],
                    "Extend: address is not a contract"
                );
            });
        
            it("replace should fail with colliding interfaceIds", async function () {
                // Here we are replacing the permissioning logic with a new extend logic that shares an interface with the old extend logic
                // This fails because there cannot exist 2 extensions with the same interface id
                await replace(caller,
                    permissioningLogic.address, newExtendLogic.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [extendLogic.address, permissioningLogic.address, replaceLogic.address],
                    "Extend: extension already exists for interfaceId"
                );
            });
        
            it("replace extend should succeed", async function () {
                await replace(caller,
                    extendLogic.address, newExtendLogic.address,
                    [REPLACE_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE], 
                    [replaceLogic.address, permissioningLogic.address, newExtendLogic.address], 
                    SHOULD_NOT_REVERT
                );
            });
        
            it("replace extend with different interface should fail", async function () {
                await replace(caller,
                    newExtendLogic.address, mockNewExtendLogic.address,
                    [REPLACE_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE], 
                    [replaceLogic.address, permissioningLogic.address, newExtendLogic.address],
                    "Replace: ExtendLogic interface of new does not match old, please only use identical ExtendLogic interfaces"
                );
            });
        
            it("replace with alterative replace extension should succeed", async function () {
                await replace(caller,
                    replaceLogic.address, alterReplaceLogic.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [newExtendLogic.address, permissioningLogic.address, alterReplaceLogic.address], 
                    SHOULD_NOT_REVERT
                );
            });
        });

        describe("alternative replace", () => {
            it("alternative replace extend should succeed", async function () {
                await replace(caller,
                    newExtendLogic.address, extendLogic.address,
                    [REPLACE_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE], 
                    [alterReplaceLogic.address, permissioningLogic.address, extendLogic.address], 
                    SHOULD_NOT_REVERT
                );
            });
        
            it("alternative replace with strict replace extension should succeed", async function () {
                await replace(caller,
                    alterReplaceLogic.address, strictReplaceLogic.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE], 
                    [extendLogic.address, permissioningLogic.address, strictReplaceLogic.address], 
                    SHOULD_NOT_REVERT
                );
            });
        });

        describe("strict replace", () => {
            it("strict replace extend should succeed", async function () {
                await replace(caller,
                    extendLogic.address, newExtendLogic.address,
                    [REPLACE_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE], 
                    [strictReplaceLogic.address, permissioningLogic.address, newExtendLogic.address], 
                    SHOULD_NOT_REVERT
                );
            });
        
            it("strict replace with different interface should fail", async function () {
                await replace(caller,
                    strictReplaceLogic.address, mockNewReplaceLogic.address,
                    [REPLACE_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE], 
                    [strictReplaceLogic.address, permissioningLogic.address, newExtendLogic.address],
                    "Replace: interface of new does not match old, please only use identical interfaces"
                );
            });
        
            it("strict replace with same interface should succeed", async function () {
                await replace(caller, 
                    strictReplaceLogic.address, alterReplaceLogic.address,
                    [EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE],
                    [newExtendLogic.address, permissioningLogic.address, alterReplaceLogic.address], 
                    SHOULD_NOT_REVERT
                );
            });
        });
    });
});

const replace = async (caller, oldExtension, newExtension, expectedInterfaceIds, expectedContractAddresses, revertMessage = false) => {
    if (revertMessage !== false) await expect(caller.callReplace(oldExtension, newExtension)).to.be.revertedWith(revertMessage);
    else await expect(caller.callReplace(oldExtension, newExtension)).to.not.be.reverted;

    await utils.checkExtensions(
        caller, 
        expectedInterfaceIds, 
        expectedContractAddresses
    );
}