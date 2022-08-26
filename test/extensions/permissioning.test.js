const { ethers } = require("hardhat");
const chai = require("chai");
const { PERMISSIONING } = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
const { getExtendedContractWithInterface, expectEvent } = require("../utils/utils");
chai.use(solidity);
const { expect } = chai;

describe("PermissioningLogic", function () {
    let account;
    let logic;
    let caller;
    const NULL_ADDRESS = "0x000000000000000000000000000000000000dEaD";
    let tx;

    beforeEach("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const Logic = await ethers.getContractFactory("PermissioningLogic");
        const Caller = await ethers.getContractFactory("PermissioningCaller");

        logic = await Logic.deploy();
        caller = await Caller.deploy(logic.address);
        await logic.deployed();
        await caller.deployed();
    });

    describe("ERC165 compatibility", async function () {
        it("should register interface id during constructor correctly", async function () {
            const extensionAsEIP165 = await getExtendedContractWithInterface(logic.address, "ERC165Logic");
            expect(await extensionAsEIP165.callStatic.supportsInterface(PERMISSIONING.INTERFACE)).to.be.true;
        });

        it("should return implemented interfaces correctly", async function () {
            expect(await logic.callStatic.getInterface()).to.deep.equal([[PERMISSIONING.INTERFACE, PERMISSIONING.SELECTORS]]);
        });

        it("should return solidity interface correctly", async function () {
            expect(await logic.callStatic.getSolidityInterface()).to.equal("".concat(
                "function init() external;\n",
                "function updateOwner(address newOwner) external;\n",
                "function renounceOwnership() external;\n",
                "function getOwner() external view returns(address);\n"
            ));
        });
    });

    describe("direct", function () {
        beforeEach("call init", async function () {
            tx = await expect(caller.init()).to.not.be.reverted;
        });

        it("initialise owner should succeed", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            expect(await logic.callStatic.getOwner()).to.equal(account.address);
        });

        it("initialise already initialised contract should fail", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.connect(account2).init()).to.be.revertedWith("PermissioningLogic: already initialised");
            expect(await logic.callStatic.getOwner()).to.equal(account.address);
        });

        it("update owner should succeed", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.updateOwner(account2.address)).to.emit(logic, "OwnerUpdated").withArgs(account2.address);
            expect(await logic.callStatic.getOwner()).to.equal(account2.address);
        });
    
        it("update owner with the zero address should fail", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.updateOwner(ethers.constants.AddressZero)).to.be.revertedWith("new owner cannot be the zero address");
            expect(await logic.callStatic.getOwner()).to.equal(account.address);
        });
    
        it("update owner when unauthorized should fail", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.connect(account2).updateOwner(account2.address)).to.be.revertedWith("unauthorised");
            expect(await logic.callStatic.getOwner()).to.equal(account.address);
        });
    
        it("update owner to original owner should succeed", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.updateOwner(account2.address)).to.emit(logic, "OwnerUpdated").withArgs(account2.address);
            await expect(logic.connect(account2).updateOwner(account.address)).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            expect(await logic.callStatic.getOwner()).to.equal(account.address);
        });
    
        it("renouncing ownership when unauthorized should fail", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.connect(account2).renounceOwnership()).to.be.revertedWith("unauthorised");
            expect(await logic.callStatic.getOwner()).to.equal(account.address);
        });

        it("renouncing ownership should set owner to the null address", async function () {
            await expect(logic.init()).to.emit(logic, "OwnerUpdated").withArgs(account.address);
            await expect(logic.renounceOwnership()).to.emit(logic, "OwnerUpdated").withArgs(NULL_ADDRESS);
            expect(await logic.callStatic.getOwner()).to.equal(NULL_ADDRESS);
        });
    });

    describe("delegated", function () {
        beforeEach("call init", async function () {
            tx = await expect(caller.init()).to.not.be.reverted;
        });

        it("initialise owner should succeed", async function () {
            await expectEvent(tx, logic.interface, "OwnerUpdated", { newOwner: account.address });
            expect(await caller.callStatic.getOwner()).to.equal(account.address);
        });

        it("initialise already initialised contract should fail", async function () {
            await expect(caller.connect(account2).init()).to.be.revertedWith("PermissioningLogic: already initialised");
            expect(await caller.callStatic.getOwner()).to.equal(account.address);
        });

        it("update owner should succeed", async function () {
            tx = await expect(caller.updateOwner(account2.address)).to.not.be.reverted;
            await expectEvent(tx, logic.interface, "OwnerUpdated", { newOwner: account2.address });
            expect(await caller.callStatic.getOwner()).to.equal(account2.address);
        });
    
        it("update owner with the zero address should fail", async function () {
            await expect(caller.updateOwner(ethers.constants.AddressZero)).to.be.revertedWith("new owner cannot be the zero address");
            expect(await caller.callStatic.getOwner()).to.equal(account.address);
        });
    
        it("update owner when unauthorized should fail", async function () {
            await expect(caller.connect(account2).updateOwner(account2.address)).to.be.revertedWith("unauthorised");
            expect(await caller.callStatic.getOwner()).to.equal(account.address);
        });
    
        it("update owner to original owner should succeed", async function () {
            tx = await expect(caller.updateOwner(account2.address)).to.not.be.reverted;
            await expectEvent(tx, logic.interface, "OwnerUpdated", { newOwner: account2.address });
            tx = await expect(caller.connect(account2).updateOwner(account.address)).to.not.be.reverted;
            await expectEvent(tx, logic.interface, "OwnerUpdated", { newOwner: account.address });
            expect(await caller.callStatic.getOwner()).to.equal(account.address);
        });
    
        it("renouncing ownership when unauthorized should fail", async function () {
            await expect(caller.connect(account2).renounceOwnership()).to.be.revertedWith("unauthorised");
            expect(await caller.callStatic.getOwner()).to.equal(account.address);
        });

        it("renouncing ownership should set owner to the null address", async function () {
            tx = await expect(caller.renounceOwnership()).to.not.be.reverted;
            await expectEvent(tx, logic.interface, "OwnerUpdated", { newOwner: NULL_ADDRESS });
            expect(await caller.callStatic.getOwner()).to.equal(NULL_ADDRESS);
        });
    });

    
});