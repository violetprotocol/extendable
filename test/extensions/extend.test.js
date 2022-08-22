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
    let mockExtend;
    let caller;
    let mockAlternative;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const PermissioningLogic = await ethers.getContractFactory("PermissioningLogic");
        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const MockExtendLogic = await ethers.getContractFactory("MockNewExtendLogic");
        const ExtendCaller = await ethers.getContractFactory("ExtendCaller");
        const MockAlternative = await ethers.getContractFactory("MockAlternative");

        permissioningLogic = await PermissioningLogic.deploy();
        extendLogic = await ExtendLogic.deploy();
        mockExtend = await MockExtendLogic.deploy();
        mockAlternative = await MockAlternative.deploy();

        await permissioningLogic.deployed();
        await extendLogic.deployed();
        await mockExtend.deployed();
        await mockAlternative.deployed();

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
        expect(await extendLogic.callStatic.getInterface()).to.deep.equal([[EXTEND.INTERFACE, EXTEND.SELECTORS]]);
    });

    it("should return solidity interface correctly", async function () {
        expect(await extendLogic.callStatic.getSolidityInterface()).to.equal("".concat(
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
            "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
        ));
    });

    it("extend should succeed", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.not.be.reverted;
        expect(await caller.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
        expect(await caller.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
        expect(await caller.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
        expect(await caller.callStatic.getCurrentInterface()).to.equal("".concat(
            "interface IExtended {\n",
                "function extend(address extension) external;\n",
                "function getCurrentInterface() external view returns(string memory);\n",
                "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                "function getExtensionAddresses() external view returns(address[] memory);\n",
            "}"
        ));
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

    it("extend should fail with already extended interfaceId", async function () {
        await expect(caller.callExtend(extendLogic.address)).to.be.revertedWith(`Extend: interface ${EXTEND.INTERFACE} is already implemented by ${extendLogic.address.toLowerCase()}`);
        await expect(caller.callExtend(mockExtend.address)).to.be.revertedWith(`Extend: interface ${EXTEND.INTERFACE} is already implemented by ${extendLogic.address.toLowerCase()}`);
    });

    it("extend should fail with already extended function", async function () {
        await expect(caller.callExtend(mockAlternative.address)).to.be.revertedWith(`Extend: function ${EXTEND.SELECTORS[0]} is already implemented by ${extendLogic.address.toLowerCase()}`);
    });
});
