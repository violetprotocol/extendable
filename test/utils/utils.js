const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;

module.exports = {
    getExtendedContractWithInterface: async (address, interface) => {
        const LogicInterface = await ethers.getContractFactory(interface);
        return (await LogicInterface.attach(address));
    },
    checkExtensions: async (contract, expectedInterfaceIds, expectedContractAddresses) => {
        expect(await contract.callStatic.getExtensions()).to.deep.equal(expectedInterfaceIds);
        expect(await contract.callStatic.getExtensionAddresses()).to.deep.equal(expectedContractAddresses);
    }
}