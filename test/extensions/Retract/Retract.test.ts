import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { ExtendLogic, PermissioningLogic, ReplaceLogic, RetractCaller, RetractLogic } from "../../../src/types";
import { shouldBehaveLikeRetract } from "./Retract.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("RetractLogic", async function () {
  before(async function () {
    const PermissioningLogic = await artifacts.readArtifact("PermissioningLogic");
    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");
    const RetractLogic = await artifacts.readArtifact("RetractLogic");
    const ReplaceLogic = await artifacts.readArtifact("ReplaceLogic");
    const RetractCaller = await artifacts.readArtifact("RetractCaller");

    this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, PermissioningLogic, []);
    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.retract = <RetractLogic>await waffle.deployContract(this.signers.admin, RetractLogic, []);
    this.replace = <ReplaceLogic>await waffle.deployContract(this.signers.admin, ReplaceLogic, []);
    this.retractCaller = <RetractCaller>(
      await waffle.deployContract(this.signers.admin, RetractCaller, [
        this.permissioning.address,
        this.extend.address,
        this.retract.address,
      ])
    );
  });

  shouldBehaveLikeRetract();
});
