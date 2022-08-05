import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { solidity } from "ethereum-waffle";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import {
  EXTEND,
  factoryABI,
  singletonFactoryAddress,
  singletonFactoryDeployer,
  singletonFactoryDeploymentTx,
} from "./constants";
import chai from "chai";

chai.use(solidity);
const { expect } = chai;

const shouldInitialiseExtendableCorrectly = async (extendableAddress: string, extendLogicAddress: string) => {
  const extendable = await getExtendedContractWithInterface(extendableAddress, "ExtendLogic");
  expect(await extendable.callStatic.getExtensionsInterfaceIds()).to.deep.equal([EXTEND.interface]);
  expect(await extendable.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(EXTEND.selectors);
  expect(await extendable.callStatic.getExtensionAddresses()).to.deep.equal([extendLogicAddress]);
  expect(await extendable.callStatic.getCurrentInterface()).to.equal(
    "".concat(
      "interface IExtended {\n",
      "function extend(address extension) external;\n",
      "function getCurrentInterface() external view returns(string memory);\n",
      "function getExtensionsInterfaceIds() external view returns(bytes4[] memory);\n",
      "function getExtensionsFunctionSelectors() external view returns(bytes4[] memory);\n",
      "function getExtensionAddresses() external view returns(address[] memory);\n",
      "}",
    ),
  );
};

const getExtendedContractWithInterface = async (address: string, interfaceName: string) => {
  const LogicInterface = await ethers.getContractFactory(interfaceName);
  return await LogicInterface.attach(address);
};

const checkExtensions = async (
  contract: Contract,
  expectedInterfaceIds: string[],
  expectedFunctionSelectors: string[],
  expectedContractAddresses: string[],
) => {
  expect(await contract.callStatic.getExtensionsInterfaceIds()).to.deep.equal(expectedInterfaceIds);
  expect(await contract.callStatic.getExtensionsFunctionSelectors()).to.deep.equal(expectedFunctionSelectors);
  expect(await contract.callStatic.getExtensionAddresses()).to.deep.equal(expectedContractAddresses);
};

export { shouldInitialiseExtendableCorrectly, getExtendedContractWithInterface, checkExtensions };
