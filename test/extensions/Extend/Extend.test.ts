import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { ExtendCaller, ExtendLogic, MockAlternative, MockNewExtendLogic, PermissioningLogic } from "../../../src/types";
import { shouldBehaveLikeExtend } from "./Extend.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("Extend Extension", async function () {
  before(async function () {
    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");
    const PermissioningLogic = await artifacts.readArtifact("PermissioningLogic");
    const MockExtendLogic = await artifacts.readArtifact("MockNewExtendLogic");
    const ExtendCaller = await artifacts.readArtifact("ExtendCaller");
    const MockAlternative = await artifacts.readArtifact("MockAlternative");

    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, PermissioningLogic, []);
    this.mockExtend = <MockNewExtendLogic>await waffle.deployContract(this.signers.admin, MockExtendLogic, []);
    this.mockAlternative = <MockAlternative>await waffle.deployContract(this.signers.admin, MockAlternative, []);
    this.extendCaller = <ExtendCaller>(
      await waffle.deployContract(this.signers.admin, ExtendCaller, [this.permissioning.address, this.extend.address])
    );
  });

  shouldBehaveLikeExtend();
});
