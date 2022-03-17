const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils/utils")
const { 
    EXTEND_LOGIC_INTERFACE, 
    PERMISSIONING_LOGIC_INTERFACE, 
    RETRACT_LOGIC_INTERFACE,
    REPLACE_LOGIC_INTERFACE,
    MOCK_CALLER_CONTEXT_INTERFACE,
    MOCK_DEEP_CALLER_CONTEXT_INTERFACE
} = require("./utils/constants")
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Extendable", function () {
    let account;
    let extendableAddress;

    let extendLogic, newExtendLogic, retractLogic, newRetractLogic, replaceLogic, strictReplaceLogic;
    
    let mockCallerContext, mockDeepCallerContext;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const PermissioningLogic = await ethers.getContractFactory("PermissioningLogic");
        const RetractLogic = await ethers.getContractFactory("RetractLogic");
        const ReplaceLogic = await ethers.getContractFactory("ReplaceLogic");
        const StrictReplaceLogic = await ethers.getContractFactory("StrictReplaceLogic");

        const MockCallerContextLogic = await ethers.getContractFactory("MockCallerContextLogic");
        const MockDeepCallerContextLogic = await ethers.getContractFactory("MockDeepCallerContextLogic");

        const Extendable = await ethers.getContractFactory("Extendable");

        extendLogic = await ExtendLogic.deploy();
        newExtendLogic = await ExtendLogic.deploy();
        permissioningLogic = await PermissioningLogic.deploy();
        retractLogic = await RetractLogic.deploy();
        newRetractLogic = await RetractLogic.deploy();
        replaceLogic = await ReplaceLogic.deploy();
        strictReplaceLogic = await StrictReplaceLogic.deploy();
        mockCallerContext = await MockCallerContextLogic.deploy();
        mockDeepCallerContext = await MockDeepCallerContextLogic.deploy();

        await extendLogic.deployed();
        await newExtendLogic.deployed();
        await permissioningLogic.deployed();
        await retractLogic.deployed();
        await newRetractLogic.deployed();
        await replaceLogic.deployed();
        await strictReplaceLogic.deployed();
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
        it("extend with permissioning should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(permissioningLogic.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address]);
    
            const extendablePer = await utils.getExtendedContractWithInterface(extendableAddress, "PermissioningLogic");
            expect(await extendablePer.callStatic.getOwner()).to.equal(account.address);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                "}"
            ));
        });
    
        it("extend with retract should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(retractLogic.address)).to.not.be.reverted;
    
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, retractLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function retract(address extension) external;\n",
                "}"
            ));
        });
    
        it("extend with replace should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(replaceLogic.address)).to.not.be.reverted;
    
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, retractLogic.address, replaceLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function retract(address extension) external;\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                "}"
            ));
        });
    })

    describe("retract", () => {
        it("retract with retract should succeed", async function () {
            const extendableRet = await utils.getExtendedContractWithInterface(extendableAddress, "RetractLogic");
            await expect(extendableRet.retract(retractLogic.address)).to.not.be.reverted;
    
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                "}"
            ));
        });
    
        it("extend with retract again should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(retractLogic.address)).to.not.be.reverted;
    
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address, retractLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                    "function retract(address extension) external;\n",
                "}"
            ));
        });
    });
    
    describe("replace", () => {
        describe("simple replace", () => {
            it("replace with new retract logic should succeed", async function () {
                const extendableRep = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableRep.replace(retractLogic.address, newRetractLogic.address)).to.not.be.reverted;
        
                const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE]);
                expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address, newRetractLogic.address]);
                expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function extend(address extension) external;\n",
                        "function getCurrentInterface() external view returns(string memory);\n",
                        "function getExtensions() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                        "function retract(address extension) external;\n",
                    "}"
                ));
            });
        
            it("replace with new extend logic should succeed", async function () {
                const extendableRep = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableRep.replace(extendLogic.address, newExtendLogic.address)).to.not.be.reverted;
        
                const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([RETRACT_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE]);
                expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, replaceLogic.address, newExtendLogic.address]);
                expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function retract(address extension) external;\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                        "function extend(address extension) external;\n",
                        "function getCurrentInterface() external view returns(string memory);\n",
                        "function getExtensions() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "}"
                ));
            });
        });

        describe("strict replace", () => {
            it("strict replace with new extend logic should succeed", async function () {
                const extendableRep = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableRep.replace(replaceLogic.address, strictReplaceLogic.address)).to.not.be.reverted;
                await expect(extendableRep.replace(newExtendLogic.address, extendLogic.address)).to.not.be.reverted;
        
                const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([RETRACT_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE]);
                expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, strictReplaceLogic.address, extendLogic.address]);
                expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function retract(address extension) external;\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                        "function extend(address extension) external;\n",
                        "function getCurrentInterface() external view returns(string memory);\n",
                        "function getExtensions() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "}"
                ));
            });
        
            it("strict replace with new replace logic should succeed", async function () {
                const extendableRep = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableRep.replace(strictReplaceLogic.address, replaceLogic.address)).to.not.be.reverted;
        
                const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([RETRACT_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE]);
                expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, extendLogic.address, replaceLogic.address]);
                expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function retract(address extension) external;\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function extend(address extension) external;\n",
                        "function getCurrentInterface() external view returns(string memory);\n",
                        "function getExtensions() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                    "}"
                ));
            });
        });
    });

    describe("caller context", async () => {
        it("should extend with caller context", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(mockCallerContext.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([RETRACT_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, MOCK_CALLER_CONTEXT_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, extendLogic.address, replaceLogic.address, mockCallerContext.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function retract(address extension) external;\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                    "function getCurrentCaller() external returns(address);\n",
                    "function getLastExternalCaller() external returns(address);\n",
                "}"
            ));
        })

        it("should extend with deep caller context", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(mockDeepCallerContext.address)).to.not.be.reverted;
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([RETRACT_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, EXTEND_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, MOCK_CALLER_CONTEXT_INTERFACE, MOCK_DEEP_CALLER_CONTEXT_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, extendLogic.address, replaceLogic.address, mockCallerContext.address, mockDeepCallerContext.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function retract(address extension) external;\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function extend(address extension) external;\n",
                    "function getCurrentInterface() external view returns(string memory);\n",
                    "function getExtensions() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                    "function getCurrentCaller() external returns(address);\n",
                    "function getLastExternalCaller() external returns(address);\n",
                    "function getDeepCurrentCaller() external returns(address);\n",
                    "function getDeepLastExternalCaller() external returns(address);\n",
                "}"
            ));
        })

        it("should record caller stack correctly", async function () {
            const extendableCC = await utils.getExtendedContractWithInterface(extendableAddress, "MockCallerContextLogic");
            expect(await extendableCC.callStatic.getCurrentCaller()).to.equal(account.address);
            expect(await extendableCC.callStatic.getLastExternalCaller()).to.equal(account.address);
        })

        it("should record deep caller stack correctly", async function () {
            const extendableCC = await utils.getExtendedContractWithInterface(extendableAddress, "MockDeepCallerContextLogic");
            expect(await extendableCC.callStatic.getDeepCurrentCaller()).to.equal(extendableAddress);
            expect(await extendableCC.callStatic.getDeepLastExternalCaller()).to.equal(account.address);
        })
    })
});