const { ethers } = require("hardhat");
const { deployERC165Singleton } = require("./utils/utils");

before("Setup", async function () {
    it("Deploy ERC165 Singleton", async function () {
        [account] = await ethers.getSigners();
        await deployERC165Singleton(account);
    })
});