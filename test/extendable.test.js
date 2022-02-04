const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils/utils")
const { 
    EXTEND_LOGIC_INTERFACE, 
    PERMISSIONING_LOGIC_INTERFACE, 
    RETRACT_LOGIC_INTERFACE,
    REPLACE_LOGIC_INTERFACE
} = require("./utils/constants")
const web3 = require("web3");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Extendable", function () {
    let account;

    let extendableAddress;
    let extendLogic;
    let newExtendLogic;
    let retractLogic;
    let newRetractLogic;
    let replaceLogic;
    let stricReplaceLogic;

    before("deploy new", async function () {
        [account] = await ethers.getSigners();

        const ExtendLogic = await ethers.getContractFactory("ExtendLogic");
        const PermissioningLogic = await ethers.getContractFactory("PermissioningLogic");
        const RetractLogic = await ethers.getContractFactory("RetractLogic");
        const ReplaceLogic = await ethers.getContractFactory("ReplaceLogic");
        const StrictReplaceLogic = await ethers.getContractFactory("StrictReplaceLogic");

        const Extendable = await ethers.getContractFactory("Extendable");

        extendLogic = await ExtendLogic.deploy();
        newExtendLogic = await ExtendLogic.deploy();
        permissioningLogic = await PermissioningLogic.deploy();
        retractLogic = await RetractLogic.deploy();
        newRetractLogic = await RetractLogic.deploy();
        replaceLogic = await ReplaceLogic.deploy();
        strictReplaceLogic = await StrictReplaceLogic.deploy();
        await extendLogic.deployed();
        await newExtendLogic.deployed();
        await permissioningLogic.deployed();
        await retractLogic.deployed();
        await newRetractLogic.deployed();
        await replaceLogic.deployed();
        await strictReplaceLogic.deployed();

        const extendable = await Extendable.deploy(extendLogic.address, permissioningLogic.address);
        await extendable.deployed();
        extendableAddress = extendable.address;
    })

    it("deploy extendable should succeed in initialising", async function () {
        const extendable = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
        expect(await extendable.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
        expect(await extendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address]);
        expect(await extendable.callStatic.getCurrentInterface()).to.equal("".concat(
            "interface IExtended {",
                "function extend(address extension) external;",
                "function getCurrentInterface() external view returns(string memory);",
                "function getExtensions() external view returns(bytes4[] memory);",
                "function getExtensionAddresses() external view returns(address[] memory);",
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
                "interface IExtended {",
                    "function extend(address extension) external;",
                    "function getCurrentInterface() external view returns(string memory);",
                    "function getExtensions() external view returns(bytes4[] memory);",
                    "function getExtensionAddresses() external view returns(address[] memory);",
                    "function init() external;",
                    "function updateOwner(address newOwner) external;",
                    "function getOwner() external view returns(address);",
                "}"
            ));
        });
    
        it("extend with retract should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(retractLogic.address)).to.not.be.reverted;
    
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, retractLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {",
                    "function extend(address extension) external;",
                    "function getCurrentInterface() external view returns(string memory);",
                    "function getExtensions() external view returns(bytes4[] memory);",
                    "function getExtensionAddresses() external view returns(address[] memory);",
                    "function init() external;",
                    "function updateOwner(address newOwner) external;",
                    "function getOwner() external view returns(address);",
                    "function retract(address extension) external;",
                "}"
            ));
        });
    
        it("extend with replace should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(replaceLogic.address)).to.not.be.reverted;
    
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, retractLogic.address, replaceLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {",
                    "function extend(address extension) external;",
                    "function getCurrentInterface() external view returns(string memory);",
                    "function getExtensions() external view returns(bytes4[] memory);",
                    "function getExtensionAddresses() external view returns(address[] memory);",
                    "function init() external;",
                    "function updateOwner(address newOwner) external;",
                    "function getOwner() external view returns(address);",
                    "function retract(address extension) external;",
                    "function replace(address oldExtension, address newExtension) external;",
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
                "interface IExtended {",
                    "function extend(address extension) external;",
                    "function getCurrentInterface() external view returns(string memory);",
                    "function getExtensions() external view returns(bytes4[] memory);",
                    "function getExtensionAddresses() external view returns(address[] memory);",
                    "function init() external;",
                    "function updateOwner(address newOwner) external;",
                    "function getOwner() external view returns(address);",
                    "function replace(address oldExtension, address newExtension) external;",
                "}"
            ));
        });
    
        it("extend with retract again should succeed", async function () {
            const extendableEx = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableEx.extend(retractLogic.address)).to.not.be.reverted;
    
            expect(await extendableEx.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE, PERMISSIONING_LOGIC_INTERFACE, REPLACE_LOGIC_INTERFACE, RETRACT_LOGIC_INTERFACE]);
            expect(await extendableEx.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address, retractLogic.address]);
            expect(await extendableEx.callStatic.getCurrentInterface()).to.equal("".concat(
                "interface IExtended {",
                    "function extend(address extension) external;",
                    "function getCurrentInterface() external view returns(string memory);",
                    "function getExtensions() external view returns(bytes4[] memory);",
                    "function getExtensionAddresses() external view returns(address[] memory);",
                    "function init() external;",
                    "function updateOwner(address newOwner) external;",
                    "function getOwner() external view returns(address);",
                    "function replace(address oldExtension, address newExtension) external;",
                    "function retract(address extension) external;",
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
                    "interface IExtended {",
                        "function extend(address extension) external;",
                        "function getCurrentInterface() external view returns(string memory);",
                        "function getExtensions() external view returns(bytes4[] memory);",
                        "function getExtensionAddresses() external view returns(address[] memory);",
                        "function init() external;",
                        "function updateOwner(address newOwner) external;",
                        "function getOwner() external view returns(address);",
                        "function replace(address oldExtension, address newExtension) external;",
                        "function retract(address extension) external;",
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
                    "interface IExtended {",
                        "function retract(address extension) external;",
                        "function init() external;",
                        "function updateOwner(address newOwner) external;",
                        "function getOwner() external view returns(address);",
                        "function replace(address oldExtension, address newExtension) external;",
                        "function extend(address extension) external;",
                        "function getCurrentInterface() external view returns(string memory);",
                        "function getExtensions() external view returns(bytes4[] memory);",
                        "function getExtensionAddresses() external view returns(address[] memory);",
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
                    "interface IExtended {",
                        "function retract(address extension) external;",
                        "function init() external;",
                        "function updateOwner(address newOwner) external;",
                        "function getOwner() external view returns(address);",
                        "function replace(address oldExtension, address newExtension) external;",
                        "function extend(address extension) external;",
                        "function getCurrentInterface() external view returns(string memory);",
                        "function getExtensions() external view returns(bytes4[] memory);",
                        "function getExtensionAddresses() external view returns(address[] memory);",
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
                    "interface IExtended {",
                        "function retract(address extension) external;",
                        "function init() external;",
                        "function updateOwner(address newOwner) external;",
                        "function getOwner() external view returns(address);",
                        "function extend(address extension) external;",
                        "function getCurrentInterface() external view returns(string memory);",
                        "function getExtensions() external view returns(bytes4[] memory);",
                        "function getExtensionAddresses() external view returns(address[] memory);",
                        "function replace(address oldExtension, address newExtension) external;",
                    "}"
                ));
            });
        });
    });
});