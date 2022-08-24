const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils")
const { 
    EXTEND_LOGIC_INTERFACE,
    MOCK_INTERNAL_EXTENSION_INTERFACE,
    MOCK_INTERNAL_EXTENSION,
    EXTEND
} = require("./constants")
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("InternalExtension", function () {
    let account;
    let extendableAddress;

    let extendLogic;
    
    let mockInternalExtension;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");

        const MockInternalExtension = await ethers.getContractFactory("MockInternalExtension");

        const Extendable = await ethers.getContractFactory("Extendable");

        extendLogic = await ExtendLogic.deploy();
        mockInternalExtension = await MockInternalExtension.deploy();

        await extendLogic.deployed();
        await mockInternalExtension.deployed();

        const extendable = await Extendable.deploy(extendLogic.address);
        await extendable.deployed();
        extendableAddress = extendable.address;
    })

    it("deploy extendable should succeed in initialising", async function () {
        await utils.shouldInitialiseExtendableCorrectly(extendableAddress, extendLogic.address);
    });

    describe("extend", () => {
        it("should extend with internal extension", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(mockInternalExtension.address)).to.not.be.reverted;
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, MOCK_INTERNAL_EXTENSION.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...MOCK_INTERNAL_EXTENSION.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, mockInternalExtension.address]);
            expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getFullInterface() external view returns(string memory);\n",
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function callInternalFunction() external;\n",
                    "function internalFunction() external;\n",
                "}"
            ));
        })
    })

    describe("internal function call", async () => {
        it("call external function successfully should succeed", async function () {
            const extendableInternalExtension = await utils.getExtendedContractWithInterface(extendableAddress, "MockInternalExtension");
            await expect(extendableInternalExtension.callInternalFunction()).to.not.be.reverted;
        })

        it("call internal function directly should fail", async function () {
            const extendableInternalExtension = await utils.getExtendedContractWithInterface(extendableAddress, "MockInternalExtension");
            await expect(extendableInternalExtension.internalFunction()).to.be.revertedWith("external caller not allowed");
        })
    })
});