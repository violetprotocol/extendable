const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const utils = require("./utils/utils")
const { 
    EXTEND_LOGIC_INTERFACE, 
    PERMISSIONING_LOGIC_INTERFACE, 
    RETRACT_LOGIC_INTERFACE,
    REPLACE_LOGIC_INTERFACE,
    PERMISSIONING,
    EXTEND,
    RETRACT,
    REPLACE
} = require("./utils/constants")
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("Extendable", function () {
    let account;
    let extendableAddress;

    let extendLogic, newExtendLogic, retractLogic, newRetractLogic, replaceLogic, strictReplaceLogic;

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

        const extendable = await Extendable.deploy(extendLogic.address);
        await extendable.deployed();
        extendableAddress = extendable.address;
    })

    it("deploy extendable should succeed in initialising", async function () {
        await utils.shouldInitialiseExtendableCorrectly(extendableAddress, extendLogic.address);
    });

    describe("extend", () => {
        it("extend with permissioning should succeed", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(permissioningLogic.address)).to.not.be.reverted;
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, PERMISSIONING.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...PERMISSIONING.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address]);
    
            const extendablePermissioningLogic = await utils.getExtendedContractWithInterface(extendableAddress, "PermissioningLogic");
            expect(await extendablePermissioningLogic.callStatic.getOwner()).to.equal(account.address);
            expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getFullInterface() external view returns(string memory);\n",        
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function renounceOwnership() external;\n",
                    "function getOwner() external view returns(address);\n",
                "}"
            ));
        });
    
        it("extend with retract should succeed", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(retractLogic.address)).to.not.be.reverted;
    
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, PERMISSIONING.INTERFACE, RETRACT.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...PERMISSIONING.SELECTORS, ...RETRACT.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, retractLogic.address]);
            expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getFullInterface() external view returns(string memory);\n",        
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function renounceOwnership() external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function retract(address extension) external;\n",
                "}"
            ));
        });
    
        it("extend with replace should succeed", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(replaceLogic.address)).to.not.be.reverted;
    
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, PERMISSIONING.INTERFACE, RETRACT.INTERFACE, REPLACE.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...PERMISSIONING.SELECTORS, ...RETRACT.SELECTORS, ...REPLACE.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, retractLogic.address, replaceLogic.address]);
            expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getFullInterface() external view returns(string memory);\n",        
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function renounceOwnership() external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function retract(address extension) external;\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                "}"
            ));
        });

        it("register interface should successfully register and return supports interface", async function () {
            const extendableAsExtension = await utils.getExtendedContractWithInterface(extendableAddress, "ERC165Logic");
            await expect(extendableAsExtension.registerInterface("0x80ac58cd")).to.not.be.reverted;
            expect(await extendableAsExtension.callStatic.supportsInterface("0x80ac58cd")).to.be.true;
        });
    })

    describe("retract", () => {
        it("retract with retract should succeed", async function () {
            const extendableRet = await utils.getExtendedContractWithInterface(extendableAddress, "RetractLogic");
            await expect(extendableRet.retract(retractLogic.address)).to.not.be.reverted;
    
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, PERMISSIONING.INTERFACE, REPLACE.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...PERMISSIONING.SELECTORS, ...REPLACE.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address]);
            expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getFullInterface() external view returns(string memory);\n",        
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function renounceOwnership() external;\n",
                    "function getOwner() external view returns(address);\n",
                    "function replace(address oldExtension, address newExtension) external;\n",
                "}"
            ));
        });
    
        it("extend with retract again should succeed", async function () {
            const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
            await expect(extendableExtendLogic.extend(retractLogic.address)).to.not.be.reverted;
    
            expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, PERMISSIONING.INTERFACE, REPLACE.INTERFACE, RETRACT.INTERFACE]);
            expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...PERMISSIONING.SELECTORS, ...REPLACE.SELECTORS, ...RETRACT.SELECTORS]);
            expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address, retractLogic.address]);
            expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                "interface IExtended {\n",
                    "function extend(address extension) external;\n",
                    "function getFullInterface() external view returns(string memory);\n",        
                    "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                    "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                    "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "function init() external;\n",
                    "function updateOwner(address newOwner) external;\n",
                    "function renounceOwnership() external;\n",
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
                const extendableReplaceLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableReplaceLogic.replace(retractLogic.address, newRetractLogic.address)).to.not.be.reverted;
        
                const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE, PERMISSIONING.INTERFACE, REPLACE.INTERFACE, RETRACT.INTERFACE]);
                expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...EXTEND.SELECTORS, ...PERMISSIONING.SELECTORS, ...REPLACE.SELECTORS, ...RETRACT.SELECTORS]);
                expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([extendLogic.address, permissioningLogic.address, replaceLogic.address, newRetractLogic.address]);
                expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function extend(address extension) external;\n",
                        "function getFullInterface() external view returns(string memory);\n",            
                        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function renounceOwnership() external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                        "function retract(address extension) external;\n",
                    "}"
                ));
            });
        
            it("replace with new extend logic should succeed", async function () {
                const extendableReplaceLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableReplaceLogic.replace(extendLogic.address, newExtendLogic.address)).to.not.be.reverted;
        
                const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([RETRACT.INTERFACE, PERMISSIONING.INTERFACE, REPLACE.INTERFACE, EXTEND.INTERFACE]);
                expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...RETRACT.SELECTORS, ...PERMISSIONING.SELECTORS, ...REPLACE.SELECTORS, ...EXTEND.SELECTORS]);
                expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, replaceLogic.address, newExtendLogic.address]);
                expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function retract(address extension) external;\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function renounceOwnership() external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                        "function extend(address extension) external;\n",
                        "function getFullInterface() external view returns(string memory);\n",            
                        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "}"
                ));
            });
        });

        describe("strict replace", () => {
            it("strict replace with new extend logic should succeed", async function () {
                const extendableReplaceLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableReplaceLogic.replace(replaceLogic.address, strictReplaceLogic.address)).to.not.be.reverted;
                await expect(extendableReplaceLogic.replace(newExtendLogic.address, extendLogic.address)).to.not.be.reverted;
        
                const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([RETRACT.INTERFACE, PERMISSIONING.INTERFACE, REPLACE.INTERFACE, EXTEND.INTERFACE]);
                expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...RETRACT.SELECTORS, ...PERMISSIONING.SELECTORS, ...REPLACE.SELECTORS, ...EXTEND.SELECTORS]);
                expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, strictReplaceLogic.address, extendLogic.address]);
                expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function retract(address extension) external;\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function renounceOwnership() external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                        "function extend(address extension) external;\n",
                        "function getFullInterface() external view returns(string memory);\n",            
                        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                    "}"
                ));
            });
        
            it("strict replace with new replace logic should succeed", async function () {
                const extendableReplaceLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ReplaceLogic");
                await expect(extendableReplaceLogic.replace(strictReplaceLogic.address, replaceLogic.address)).to.not.be.reverted;
        
                const extendableExtendLogic = await utils.getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
                expect(await extendableExtendLogic.callStatic.getExtensionsInterfaceIds()).to.deep.equal([RETRACT.INTERFACE, PERMISSIONING.INTERFACE, EXTEND.INTERFACE, REPLACE.INTERFACE]);
                expect(await extendableExtendLogic.callStatic.getExtensionsFunctionSelectors()).to.deep.equal([...RETRACT.SELECTORS, ...PERMISSIONING.SELECTORS, ...EXTEND.SELECTORS, ...REPLACE.SELECTORS]);
                expect(await extendableExtendLogic.callStatic.getExtensionAddresses()).to.deep.equal([newRetractLogic.address, permissioningLogic.address, extendLogic.address, replaceLogic.address]);
                expect(await extendableExtendLogic.callStatic.getFullInterface()).to.equal("".concat(
                    "interface IExtended {\n",
                        "function retract(address extension) external;\n",
                        "function init() external;\n",
                        "function updateOwner(address newOwner) external;\n",
                        "function renounceOwnership() external;\n",
                        "function getOwner() external view returns(address);\n",
                        "function extend(address extension) external;\n",
                        "function getFullInterface() external view returns(string memory);\n",            
                        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
                        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
                        "function getExtensionAddresses() external view returns(address[] memory);\n",
                        "function replace(address oldExtension, address newExtension) external;\n",
                    "}"
                ));
            });
        });
    });
});