const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { erc165SingletonAddress } = require("../utils/constants");
const { deployERC165Singleton } = require("../utils/utils");
chai.use(solidity);
const { expect, assert } = chai;

describe("ERC165Logic", function () {
    const interfaceId = "0x80ac58cd";
    const invalidInterface = "0xffffffff";
    let account;
    let erc165;
    let erc165Caller;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();
        
        await deployERC165Singleton(account);

        const ERC165Logic = await ethers.getContractFactory("ERC165Logic");
        const ERC165Caller = await ethers.getContractFactory("ERC165Caller");
        erc165 = await ERC165Logic.attach(erc165SingletonAddress);
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