import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { Extendable, ExtendLogic, MockReentrancyLogic } from "../../../src/types";
import { shouldBehaveLikeReetrancyGuard } from "./Reentrancy.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ReentrancyGuard", async function () {
  before(async function () {
    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];

    const ExtendLogic = await artifacts.readArtifact("ExtendLogic");
    const MockReentrancyLogic = await artifacts.readArtifact("MockReentrancyLogic");
    const Extendable = await artifacts.readArtifact("Extendable");

    this.extend = <ExtendLogic>await waffle.deployContract(this.signers.admin, ExtendLogic, []);
    this.reentrancy = <MockReentrancyLogic>await waffle.deployContract(this.signers.admin, MockReentrancyLogic, []);
    this.extendableInternal = <Extendable>(
      await waffle.deployContract(this.signers.admin, Extendable, [this.extend.address])
    );
    this.extendableExternal = <Extendable>(
      await waffle.deployContract(this.signers.admin, Extendable, [this.extend.address])
    );
  });

  shouldBehaveLikeReetrancyGuard();
});
