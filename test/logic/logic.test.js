const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Logic", function () {
    let account;
    let logic;
    let caller;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const Logic = await ethers.getContractFactory("MockLogic");
        const Caller = await ethers.getContractFactory("MockLogicCaller");

        logic = await Logic.deploy();
        caller = await Caller.deploy();

        await logic.deployed();
        await caller.deployed();
    })

    it("call function should succeed", async function () {
        await expect(caller.callTest(logic.address)).to.emit(logic, 'Test');
    });

    it("call function should fail", async function () {
        await expect(caller.callFake(logic.address)).to.be.revertedWith('ExtensionNotImplemented');
    });
});
