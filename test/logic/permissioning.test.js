const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("PermissioningLogic", function () {
    let account;
    let logic;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const Logic = await ethers.getContractFactory("PermissioningLogic");
        logic = await Logic.deploy();
        await logic.deployed();
    })

    it("initialise permissioning should succeed", async function () {
        await expect(logic.init()).to.not.be.reverted;
        expect(await logic.callStatic.getOwner()).to.equal(account.address);
    });

    it("update owner should succeed", async function () {
        await expect(logic.updateOwner(account2.address)).to.not.be.reverted;
        expect(await logic.callStatic.getOwner()).to.equal(account2.address);
    });

    it("update owner should fail", async function () {
        await expect(logic.updateOwner(account.address)).to.be.revertedWith("unauthorised");
        expect(await logic.callStatic.getOwner()).to.equal(account2.address);
    });

    it("update owner to original owner should succeed", async function () {
        await expect(logic.connect(account2).updateOwner(account.address)).to.not.be.reverted;
        expect(await logic.callStatic.getOwner()).to.equal(account.address);
    });
});