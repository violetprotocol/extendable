import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { ERC165Logic } from "../src/types";
import { Signers } from "./types";
import {
  erc165SingletonAddress,
  factoryABI,
  singletonFactoryAddress,
  singletonFactoryDeployer,
  singletonFactoryDeploymentTx,
} from "./utils/constants";

before("Setup", async function () {
  it("Initialise signers", async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
  });

  it("Deploy ERC165 Singleton", async function () {
    const ERC165Logic = await ethers.getContractFactory("ERC165Logic");
    const bytecode = (await ERC165Logic.getDeployTransaction()).data;

    await this.signers.admin.sendTransaction({ to: singletonFactoryDeployer, value: ethers.utils.parseEther("1") });
    await ethers.provider.sendTransaction(singletonFactoryDeploymentTx);

    const Factory = new ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, this.signers.admin);
    const factory = await Factory.attach(singletonFactoryAddress);
    await factory.deploy(bytecode, "0x0000000000000000000000000000000000000000000000000000000000000000", {
      gasLimit: "0x07A120",
    });

    this.erc165 = <ERC165Logic>await ethers.getContractAt("ERC165Logic", erc165SingletonAddress);
    console.log(await ethers.provider.getCode(erc165SingletonAddress));
  });
});
