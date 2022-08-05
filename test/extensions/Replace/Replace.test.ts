import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import {
  ExtendLogic,
  MockNewExtendLogic,
  MockNewReplaceLogic,
  PermissioningLogic,
  ReplaceCaller,
  ReplaceLogic,
  RetractCaller,
  RetractLogic,
  StrictReplaceLogic,
} from "../../../src/types";
import { shouldBehaveLikeReplace } from "./Replace.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ReplaceLogic", async function () {
  before(async function () {
    const PermissioningLogic = await artifacts.readArtifact("PermissioningLogic");
    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");

    const RetractLogic = await artifacts.readArtifact("RetractLogic");
    const RetractCaller = await artifacts.readArtifact("RetractCaller");

    const ReplaceLogic = await artifacts.readArtifact("ReplaceLogic");
    const StrictReplaceLogic = await artifacts.readArtifact("StrictReplaceLogic");
    const ReplaceCaller = await artifacts.readArtifact("ReplaceCaller");

    const MockNewExtendLogic = await artifacts.readArtifact("MockNewExtendLogic");
    const MockNewReplaceLogic = await artifacts.readArtifact("MockNewReplaceLogic");

    this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, PermissioningLogic, []);
    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.retract = <RetractLogic>await waffle.deployContract(this.signers.admin, RetractLogic, []);
    this.retractCaller = <RetractCaller>(
      await waffle.deployContract(this.signers.admin, RetractCaller, [
        this.permissioning.address,
        this.extend.address,
        this.retract.address,
      ])
    );
    this.replace = <ReplaceLogic>await waffle.deployContract(this.signers.admin, ReplaceLogic, []);
    this.strictReplace = <StrictReplaceLogic>await waffle.deployContract(this.signers.admin, StrictReplaceLogic, []);
    this.replaceCaller = <ReplaceCaller>(
      await waffle.deployContract(this.signers.admin, ReplaceCaller, [
        this.permissioning.address,
        this.extend.address,
        this.retract.address,
        this.replace.address,
      ])
    );
    this.replace = <ReplaceLogic>await waffle.deployContract(this.signers.admin, ReplaceLogic, []);
    this.newExtend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.mockExtend = <MockNewExtendLogic>await waffle.deployContract(this.signers.admin, MockNewExtendLogic, []);
    this.mockReplace = <MockNewReplaceLogic>await waffle.deployContract(this.signers.admin, MockNewReplaceLogic, []);
  });

  shouldBehaveLikeReplace();
});
