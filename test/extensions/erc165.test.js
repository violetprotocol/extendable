const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { erc165SingletonAddress } = require("../utils/constants");
chai.use(solidity);
const { expect } = chai;

describe("ERC165Logic", function () {
    const interfaceId = "0x80ac58cd";
    const invalidInterface = "0xffffffff";
    let account;
    let erc165;
    let erc165Caller;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

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