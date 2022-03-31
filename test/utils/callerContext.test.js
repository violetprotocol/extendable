const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils")
const { 
    EXTEND_LOGIC_INTERFACE,
    MOCK_CALLER_CONTEXT_INTERFACE,
    MOCK_DEEP_CALLER_CONTEXT_INTERFACE
} = require("./constants")
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("CallerContext", function () {
    let account;
    let extendableAddress;

    let extendLogic;
    
    let mockCallerContext, mockDeepCallerContext;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");

        const MockCallerContextLogic = await ethers.getContractFactory("MockCallerContextLogic");
        const MockDeepCallerContextLogic = await ethers.getContractFactory("MockDeepCallerContextLogic");

        const Extendable = await ethers.getContractFactory("Extendable");

        extendLogic = await ExtendLogic.deploy();
        mockCallerContext = await MockCallerContextLogic.deploy();
        mockDeepCallerContext = await MockDeepCallerContextLogic.deploy();

        await extendLogic.deployed();
        await mockCallerContext.deployed();
        await mockDeepCallerContext.deployed();

        const extendable = await Extendable.deploy(extendLogic.address);
        await extendable.deployed();
        extendableAddress = extendable.address;
    })

    it("deploy extendable should succeed in initialising", async function () {
        const extendable = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
        expect(await extendable.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await extendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
        expect(await extendable.callStatic.getCurrentInterface()).to.equal("".concat(
            "interface IExtended {\n",
            "function extend(address extension) external;\n",
            "function getCurrentInterface() external view returns(string memory);\n",
            "function getExtensions() external view returns(bytes4[] memory);\n",
            "function getExtensionAddresses() external view returns(address[] memory);\n",
            "}"
        ));
    });

    describe("extend", () => {
        it("should extend with caller context", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(mockCallerContext.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, MOCK_CALLER_CONTEXT_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, mockCallerContext.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function getCurrentCaller() external returns(address);\n",
                    "function getLastExternalCaller() external returns(address);\n",
                "}"
            ));
        })

        it("should extend with deep caller context", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(mockDeepCallerContext.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, MOCK_CALLER_CONTEXT_INTERFACE, MOCK_DEEP_CALLER_CONTEXT_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, mockCallerContext.address, mockDeepCallerContext.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function getCurrentCaller() external returns(address);\n",
                    "function getLastExternalCaller() external returns(address);\n",
                    "function getDeepCurrentCaller() external returns(address);\n",
                    "function getDeepLastExternalCaller() external returns(address);\n",
                "}"
            ));
        })
    })

    describe("caller context", async () => {
        it("should record caller stack correctly", async function () {
            const extendableCC = await utils.getExtendedContractWithInterface(extendableAddress, "MockCallerContextLogic");
            expect(await extendableCC.callStatic.getCurrentCaller()).to.equal(account.address);
            expect(await extendableCC.callStatic.getLastExternalCaller()).to.equal(account.address);

            // callerstack should always be empty by the end of an execution, but the call navigates through a stackpush which places
            // the current caller on the callstack
            expect(await extendableCC.callStatic.getCallerStack()).to.deep.equal([account.address]);
        })

        it("should record deep caller stack correctly", async function () {
            let extendableCC = await utils.getExtendedContractWithInterface(extendableAddress, "MockDeepCallerContextLogic");
            expect(await extendableCC.callStatic.getDeepCurrentCaller()).to.equal(extendableAddress);
            expect(await extendableCC.callStatic.getDeepLastExternalCaller()).to.equal(account.address);

            // callerstack should always be empty by the end of an execution, but the call navigates through a stackpush which places
            // the current caller on the callstack, in this case it calls through the EOA and the contract
            expect(await extendableCC.callStatic.getDeepCallerStack()).to.deep.equal([account.address, extendableAddress]);
        })
    })
});