const { ethers } = require("hardhat");
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
const { expect, assert } = chai;
const {singletonFactoryDeployer, singletonFactoryDeploymentTx, singletonFactoryAddress, factoryABI, EXTEND, erc165Bytecode, erc165DeploymentSalt} = require("./constants");

const shouldInitialiseExtendableCorrectly = async (extendableAddress, extendLogicAddress) => {
    const extendable = await getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
    expect(await extendable.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.INTERFACE]);
    expect(await extendable.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.SELECTORS);
    expect(await extendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogicAddress]);
    expect(await extendable.callStatic.getFullInterface()).to.equal("".concat(
        "interface IExtended {\n",
        "function extend(address extension) external;\n",
        "function getFullInterface() external view returns(string memory);\n",
        "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
        "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
        "function getExtensionAddresses() external view returns(address[] memory);\n",
        "}"
    ));
}

const getExtendedContractWithInterface = async (address, interface) => {
    const LogicInterface = await ethers.getContractFactory(interface);
    return (await LogicInterface.attach(address));
}

const checkExtensions = async (contract, expectedInterfaceIds, expectedFunctionSelectors, expectedContractAddresses) => {
    expect(await contract.callStatic.getExtensionsInterfaceIds()).to.deep.equal(expectedInterfaceIds);
    expect(await contract.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(expectedFunctionSelectors);
    expect(await contract.callStatic.getExtensionAddresses()).to.deep.equal(expectedContractAddresses);
}

const deployERC165Singleton = async (deployer) => {
    await deployer.sendTransaction({ to: singletonFactoryDeployer, value: ethers.utils.parseEther("1") });
    await ethers.provider.sendTransaction(singletonFactoryDeploymentTx);

    const Factory = new ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, deployer);
    const factory = await Factory.attach(singletonFactoryAddress);
    await factory.deploy(erc165Bytecode, erc165DeploymentSalt, { gasLimit: "0x07A120" });
}

module.exports = {
    shouldInitialiseExtendableCorrectly,
    getExtendedContractWithInterface,
    checkExtensions,
    deployERC165Singleton
}