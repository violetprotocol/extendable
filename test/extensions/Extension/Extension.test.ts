import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { MockExtension, MockExtensionCaller } from "../../../src/types";
import { shouldBehaveLikeExtension } from "./Extension.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("Extension", async function () {
  before(async function () {
    const Extension = await artifacts.readArtifact("MockExtension");
    const Caller = await artifacts.readArtifact("MockExtensionCaller");

    this.mockExtension = <MockExtension>await waffle.deployContract(this.signers.admin, Extension, []);
    this.mockExtensionCaller = <MockExtensionCaller>await waffle.deployContract(this.signers.admin, Caller, []);
  });

  shouldBehaveLikeExtension();
});
