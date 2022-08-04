const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils")
const { 
    EXTEND,
    MOCK_CALLER_CONTEXT,
    MOCK_DEEP_CALLER_CONTEXT
} = require("./constants")
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
        await utils.shouldInitialiseExtendableCorrectly(extendableAddress, extendLogic.address);
    });

    describe("extend", () => {
        it("should extend with caller context", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(mockCallerContext.address)).to.not.be.reverted;
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, MOCK_CALLER_CONTEXT.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...MOCK_CALLER_CONTEXT.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, mockCallerContext.address]);
            expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function getCallerStack() external returns(address[] memory);\n",
                    "function getCurrentCaller() external returns(address);\n",
                    "function getLastExternalCaller() external returns(address);\n",
                "}"
            ));
        })

        it("should extend with deep caller context", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(mockDeepCallerContext.address)).to.not.be.reverted;
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, MOCK_CALLER_CONTEXT.INTERFACE, MOCK_DEEP_CALLER_CONTEXT.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...MOCK_CALLER_CONTEXT.SELECTORS, ...MOCK_DEEP_CALLER_CONTEXT.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, mockCallerContext.address, mockDeepCallerContext.address]);
            console.log(await mockDeepCallerContext.callStatic.getSolidityInterface());
            expect(await extendableExtendLogic.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function getCallerStack() external returns(address[] memory);\n",
                    "function getCurrentCaller() external returns(address);\n",
                    "function getLastExternalCaller() external returns(address);\n",
                    "function getDeepCallerStack() external returns(address[] memory);\n",
                    "function getDeepCurrentCaller() external returns(address);\n",
                    "function getDeepLastExternalCaller() external returns(address);\n",
                "}"
            ));
        })
    })

    describe("caller context", async () => {
        it("should record caller stack correctly", async function () {
            const extendableCallerContextLogic = await utils.getExtendedContractWithInterface(extendableAddress, "MockCallerContextLogic");
            expect(await extendableCallerContextLogic.callStatic.getCurrentCaller()).to.equal(account.address);
            expect(await extendableCallerContextLogic.callStatic.getLastExternalCaller()).to.equal(account.address);

            // callerstack should always be empty by the end of an execution, but the call navigates through a stackpush which places
            // the current caller on the callstack
            expect(await extendableCallerContextLogic.callStatic.getCallerStack()).to.deep.equal([account.address]);
        })

        it("should record deep caller stack correctly", async function () {
            let extendableCallerContextLogic = await utils.getExtendedContractWithInterface(extendableAddress, "MockDeepCallerContextLogic");
            expect(await extendableCallerContextLogic.callStatic.getDeepCurrentCaller()).to.equal(extendableAddress);
            expect(await extendableCallerContextLogic.callStatic.getDeepLastExternalCaller()).to.equal(account.address);

            // callerstack should always be empty by the end of an execution, but the call navigates through a stackpush which places
            // the current caller on the callstack, in this case it calls through the EOA and the contract
            expect(await extendableCallerContextLogic.callStatic.getDeepCallerStack()).to.deep.equal([account.address, extendableAddress]);
        })
    })
});