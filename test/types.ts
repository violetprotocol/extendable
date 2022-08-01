import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import { 
  ERC165Logic,
  ExtendLogic,
  Extension,
  PermissioningLogic,
  ReplaceLogic,
 } from "../src/types";
import { Artifact } from "hardhat/types";
import { Contract } from "ethers";
import { waffle, ethers } from "hardhat";

declare module "mocha" {
  export interface Context {
    name: string;
    symbol: string;
    erc165: ERC165Logic;
    extension: Extension;
    extend: ExtendLogic;
    permissioning: PermissioningLogic;
    replace: ReplaceLogic;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  operator: SignerWithAddress;
  owner: SignerWithAddress;
  newOwner: SignerWithAddress;
  toWhom: SignerWithAddress;
  other: SignerWithAddress;
  approved: SignerWithAddress;
  anotherApproved: SignerWithAddress;
  user: SignerWithAddress;
}

export type Extended<T extends Contract> = T & {
  as<T>(artifact: Artifact): T;
};

export const deployExtendableContract = async <T extends Contract>(deployer: SignerWithAddress, artifact: Artifact, params: any[]): Promise<Extended<T>> => {
  const contract = <Extended<T>>await waffle.deployContract(deployer, artifact, [...params]);
  contract.as = <T>(artifact: Artifact) => {
    return <T><unknown>ethers.getContractAtFromArtifact(artifact, contract.address);
  }

  return contract;
}

export const attachExtendableContract = async <T extends Contract>(artifact: Artifact, address: string): Promise<Extended<T>> => {
  const contract = <Extended<T>>await ethers.getContractAtFromArtifact(artifact, address);
  contract.as = <T>(artifact: Artifact) => {
    return <T><unknown>ethers.getContractAtFromArtifact(artifact, contract.address);
  }

  return contract;
}