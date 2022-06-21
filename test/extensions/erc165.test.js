const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const web3 = require("web3");
const chai = require("chai");
const utils = require("../utils/utils")
const { EXTEND_LOGIC_INTERFACE } = require("../utils/constants")
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

describe("ERC165Logic", function () {
    let account;

    before("deploy new", async function () {
        [account, account2] = await ethers.getSigners();

        const ERC165Logic = await ethers.getContractFactory("ERC165Logic");
        const tx = await ERC165Logic.getDeployTransaction();
        const signature = await account.signTransaction(tx);
        console.log(signature);
    })
});
