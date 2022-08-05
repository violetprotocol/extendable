import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import {
  Extendable,
  ExtendLogic,
  PermissioningLogic,
  ReplaceLogic,
  RetractLogic,
  StrictReplaceLogic,
} from "../../src/types";
import { shouldBehaveLikeExtendable } from "./Extendable.behaviour";

describe("Extendable", async function () {
  before(async function () {
    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");
    const PermissioningLogic = await artifacts.readArtifact("PermissioningLogic");
    const RetractLogic = await artifacts.readArtifact("RetractLogic");
    const ReplaceLogic = await artifacts.readArtifact("ReplaceLogic");
    const StrictReplaceLogic = await artifacts.readArtifact("StrictReplaceLogic");

    const Extendable = await artifacts.readArtifact("Extendable");

    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.newExtend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.permissioning = <PermissioningLogic>await waffle.deployContract(this.signers.admin, PermissioningLogic, []);
    this.retract = <RetractLogic>await waffle.deployContract(this.signers.admin, RetractLogic, []);
    this.newRetract = <RetractLogic>await waffle.deployContract(this.signers.admin, RetractLogic, []);
    this.replace = <ReplaceLogic>await waffle.deployContract(this.signers.admin, ReplaceLogic, []);
    this.strictReplace = <StrictReplaceLogic>await waffle.deployContract(this.signers.admin, StrictReplaceLogic, []);

    this.extendable = <Extendable>await waffle.deployContract(this.signers.admin, Extendable, [this.extend.address]);
  });

  shouldBehaveLikeExtendable();
});
