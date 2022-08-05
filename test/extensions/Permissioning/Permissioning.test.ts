import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { PermissioningCaller, PermissioningLogic } from "../../../src/types";
import { shouldBehaveLikePermissioning } from "./Permissioning.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("PermissioningLogic", async function () {
  before(async function () {
    const PermissioningLogic = await artifacts.readArtifact("PermissioningLogic");
    const PermissioningCaller = await artifacts.readArtifact("PermissioningCaller");

    this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, PermissioningLogic, []);
    this.permissioningCaller = <PermissioningCaller>(
      await waffle.deployContract(this.signers.admin, PermissioningCaller, [])
    );
  });

  shouldBehaveLikePermissioning();
});
