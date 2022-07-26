const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("ERC165Logic", function () {
    const singletonFactoryDeploymentTx = "0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470";
    const singletonFactoryDeployer = "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D";
    const singletonFactoryAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
    const erc165Address = "0x23A6e4d33CFF52F908f3Ed8f7E883D2A91A4918f";
    const interfaceId = "0x80ac58cd";
    const invalidInterface = "0xffffffff";
    let account;
    let erc165;
    let erc165Caller;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();
        
        const ERC165Logic = await ethers.getContractFactory("ERC165Logic");
        const bytecode = (await ERC165Logic.getDeployTransaction()).data;

        await account.sendTransaction({ to: singletonFactoryDeployer, value: ethers.utils.parseEther("1") });
        await ethers.provider.sendTransaction(singletonFactoryDeploymentTx);

        const Factory = new hre.ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, account);
        const factory = await Factory.attach(singletonFactoryAddress);
        await factory.deploy(bytecode, "0x0000000000000000000000000000000000000000000000000000000000000000", { gasLimit: "0x07A120" });

        const ERC165Caller = await ethers.getContractFactory("ERC165Caller");
        erc165 = await ERC165Logic.attach(erc165Address);
        erc165Caller = await ERC165Caller.deploy(erc165.address);
    })

    context("delegated", async function () {
        it("Register interface should register correctly", async function () {
            await expect(erc165Caller.callRegisterInterface(interfaceId)).to.not.be.reverted;
            expect(await erc165Caller.callStatic.callSupportsInterface(interfaceId)).to.be.true;
        });

        it("Register invalid interface should fail", async function () {
            await expect(erc165Caller.callRegisterInterface(invalidInterface)).to.be.revertedWith("ERC165: invalid interface id");
            expect(await erc165Caller.callStatic.callSupportsInterface(invalidInterface)).to.be.false;
        });
    });

    context("direct", async function () {
        it("Register interface should fail", async function () {
            await expect(erc165.registerInterface(interfaceId)).to.be.revertedWith("ERC165Logic: undelegated calls disallowed");
            await expect(erc165.supportsInterface(interfaceId)).to.be.revertedWith("ERC165Logic: undelegated calls disallowed");
        });
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