const { ethers } = require("hardhat");
const chai = require("chai");
const {
    BASE_EXTENSION_INTERFACE,
    EIP165_INTERFACE,
    MOCK_LOGIC_INTERFACE
} = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
const { getExtendedContractWithInterface } = require("../utils/utils");
chai.use(solidity);
const { expect, assert } = chai;

describe("Extension", function () {
    const singletonFactoryDeploymentTx = "0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470";
    const singletonFactoryDeployer = "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D";
    const singletonFactoryAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
    const erc165Address = "0x23A6e4d33CFF52F908f3Ed8f7E883D2A91A4918f";

    let account;
    let extension;
    let caller;
    let extensionAsEIP165;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();
        
        const ERC165Logic = await ethers.getContractFactory("ERC165Logic");
        const bytecode = (await ERC165Logic.getDeployTransaction()).data;

        await account.sendTransaction({ to: singletonFactoryDeployer, value: ethers.utils.parseEther("1") });
        await ethers.provider.sendTransaction(singletonFactoryDeploymentTx);

        const Factory = new hre.ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, account);
        const factory = await Factory.attach(singletonFactoryAddress);
        await factory.deploy(bytecode, "0x0000000000000000000000000000000000000000000000000000000000000000", { gasLimit: "0x07A120" });

        const Extension = await ethers.getContractFactory("MockExtension");
        const Caller = await ethers.getContractFactory("MockExtensionCaller");

        extension = await Extension.deploy();
        caller = await Caller.deploy();

        await extension.deployed();
        await caller.deployed();

        extensionAsEIP165 = await getExtendedContractWithInterface(extension.address, "ERC165Logic");
    })

    it("call test function should succeed", async function () {
        await expect(caller.callTest(extension.address)).to.emit(extension, 'Test');
    });

    it("call fake function should fail", async function () {
        await expect(caller.callFake(extension.address)).to.be.revertedWith('ExtensionNotImplemented');
    });

    it("call reverts should fail normally", async function () {
        await expect(extension.reverts()).to.be.revertedWith('normal reversion');
    });

    it("should integrate with EIP-165 correctly", async function () {
        expect(await extension.callStatic.supportsInterface(EIP165_INTERFACE)).to.be.true;
    });

    it("should implement IExtension correctly", async function () {
        expect(await extension.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
    });

    it("should register extension interface id during constructor correctly", async function () {
        expect(await extension.callStatic.supportsInterface(MOCK_LOGIC_INTERFACE)).to.be.true;
        expect(await extension.callStatic.supportsInterface(BASE_EXTENSION_INTERFACE)).to.be.true;
    });

    it("should return implemented interfaces correctly", async function () {
        expect(await extension.callStatic.getImplementedInterfaces()).to.deep.equal([MOCK_LOGIC_INTERFACE]);
    });

    it("should return function selectors correctly", async function () {
        expect(await extension.callStatic.getImplementedInterfaces()).to.deep.equal([MOCK_LOGIC_INTERFACE]);
    });

    it("should return verbose extension interface correctly", async function () {
        expect(await extension.callStatic.getInterface()).to.equal("".concat(
            "function test() external;\n",
            "function reverts() external;\n"
        ));
    });
});


const factoryABI = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes",
                "name": "_initCode",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "_salt",
                "type": "bytes32"
            }
        ],
        "name": "deploy",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "createdContract",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]