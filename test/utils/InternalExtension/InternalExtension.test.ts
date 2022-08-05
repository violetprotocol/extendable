import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { Extendable, ExtendLogic, MockInternalExtension } from "../../../src/types";
import { shouldBehaveLikeInternalExtension } from "./InternalExtension.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("CallerContext", async function () {
  before(async function () {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");
    const MockInternalExtension = await artifacts.readArtifact("MockInternalExtension");
    const Extendable = await artifacts.readArtifact("Extendable");

    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.internalExtension = <MockInternalExtension>(
      await waffle.deployContract(this.signers.admin, MockInternalExtension, [])
    );
    this.extendable = <Extendable>await waffle.deployContract(this.signers.admin, Extendable, [this.extend.address]);
  });

  shouldBehaveLikeInternalExtension();
});
