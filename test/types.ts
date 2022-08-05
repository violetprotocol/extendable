import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import type { Fixture } from "ethereum-waffle";
import {
  ERC165Logic,
  ERC165Caller,
  ExtendLogic,
  Extension,
  PermissioningLogic,
  PermissioningCaller,
  ReplaceLogic,
  MockNewExtendLogic,
  ExtendCaller,
  MockAlternative,
  MockExtension,
  MockExtensionCaller,
  RetractLogic,
  RetractCaller,
  ReplaceCaller,
  MockNewReplaceLogic,
  StrictReplaceLogic,
  MockCallerContextLogic,
  MockDeepCallerContextLogic,
  Extendable,
  MockReentrancyLogic,
  MockInternalExtension,
} from "../src/types";
import { Artifact } from "hardhat/types";
import { Contract } from "ethers";
import { waffle, ethers, artifacts } from "hardhat";

declare module "mocha" {
  export interface Context {
    name: string;
    symbol: string;
    erc165: ERC165Logic;
    erc165Caller: ERC165Caller;
    extension: Extension;
    mockExtension: MockExtension;
    mockExtensionCaller: MockExtensionCaller;
    extend: ExtendLogic;
    newExtend: ExtendLogic;
    mockExtend: MockNewExtendLogic;
    mockAlternative: MockAlternative;
    extendCaller: ExtendCaller;
    permissioning: PermissioningLogic;
    permissioningCaller: PermissioningCaller;
    retract: RetractLogic;
    newRetract: RetractLogic;
    retractCaller: RetractCaller;
    replace: ReplaceLogic;
    strictReplace: StrictReplaceLogic;
    replaceCaller: ReplaceCaller;
    mockReplace: MockNewReplaceLogic;
    mockCallerContext: MockCallerContextLogic;
    mockDeepCallerContext: MockDeepCallerContextLogic;
    reentrancy: MockReentrancyLogic;
    internalExtension: MockInternalExtension;
    extendable: Extendable;
    extendableInternal: Extendable;
    extendableExternal: Extendable;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
  owner: SignerWithAddress;
  user: SignerWithAddress;
}

export type Extended<T extends Contract> = T & {
  as<T>(artifactName: string): Promise<T>;
};

export const deployExtendableContract = async <T extends Contract>(
  deployer: SignerWithAddress,
  artifact: Artifact,
  params: any[],
): Promise<Extended<T>> => {
  const contract = <Extended<T>>await waffle.deployContract(deployer, artifact, [...params]);
  contract.as = async <T>(artifactName: string) => {
    const artifact = await artifacts.readArtifact(artifactName);
    return <T>(<unknown>ethers.getContractAtFromArtifact(artifact, contract.address));
  };

  return contract;
};

export const attachExtendableContract = async <T extends Contract>(
  artifactName: string,
  address: string,
): Promise<Extended<T>> => {
  const artifact = await artifacts.readArtifact(artifactName);
  const contract = <Extended<T>>await ethers.getContractAtFromArtifact(artifact, address);
  contract.as = async <T>(artifactName: string) => {
    const artifact = await artifacts.readArtifact(artifactName);
    return <T>(<unknown>ethers.getContractAtFromArtifact(artifact, contract.address));
  };

  return contract;
};
