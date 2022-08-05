import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { Extendable, ExtendLogic, MockCallerContextLogic, MockDeepCallerContextLogic } from "../../../src/types";
import { shouldBehaveLikeCallerContext } from "./CallerContext.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("CallerContext", async function () {
  before(async function () {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");

    const MockCallerContextLogic = await artifacts.readArtifact("MockCallerContextLogic");
    const MockDeepCallerContextLogic = await artifacts.readArtifact("MockDeepCallerContextLogic");

    const Extendable = await artifacts.readArtifact("Extendable");

    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.mockCallerContext = <MockCallerContextLogic>(
      await waffle.deployContract(this.signers.admin, MockCallerContextLogic, [])
    );
    this.mockDeepCallerContext = <MockDeepCallerContextLogic>(
      await waffle.deployContract(this.signers.admin, MockDeepCallerContextLogic, [])
    );

    this.extendable = <Extendable>await waffle.deployContract(this.signers.admin, Extendable, [this.extend.address]);
  });

  shouldBehaveLikeCallerContext();
});
