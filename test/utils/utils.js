const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;
const {EXTEND_LOGIC_INTERFACE} = require("./constants");

const shouldInitialiseExtendableCorrectly = async (extendableAddress, extendLogicAddress) => {
    const extendable = await getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
    expect(await extendable.callStatic.getExtensions()).to.deep.equal([EXTEND_LOGIC_INTERFACE]);
    expect(await extendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogicAddress]);
    expect(await extendable.callStatic.getCurrentInterface()).to.equal("".concat(
        "interface IExtended {\n",
        "function extend(address extension) external;\n",
        "function getCurrentInterface() external view returns(string memory);\n",
        "function getExtensions() external view returns(bytes4[] memory);\n",
        "function getExtensionAddresses() external view returns(address[] memory);\n",
        "}"
    ));
}

const getExtendedContractWithInterface = async (address, interface) => {
    const LogicInterface = await ethers.getContractFactory(interface);
    return (await LogicInterface.attach(address));
}

const checkExtensions = async (contract, expectedInterfaceIds, expectedContractAddresses) => {
    expect(await contract.callStatic.getExtensions()).to.deep.equal(expectedInterfaceIds);
    expect(await contract.callStatic.getExtensionAddresses()).to.deep.equal(expectedContractAddresses);
}

module.exports = {
    shouldInitialiseExtendableCorrectly,
    getExtendedContractWithInterface,
    checkExtensions
}