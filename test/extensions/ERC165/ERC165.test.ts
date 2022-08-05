import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { artifacts, ethers, waffle } from "hardhat";
import { ERC165Caller } from "../../../src/types";
import { erc165SingletonAddress } from "../../utils/constants";
import { shouldBehaveLikeERC165 } from "./ERC165.behaviour";

const chai = require("chai");
const { solidity } = waffle;
chai.use(solidity);

describe("ERC165 Singleton", async function () {
  before(async function () {
    const ERC165Caller = await artifacts.readArtifact("ERC165Caller");
    this.erc165Caller = <ERC165Caller>(
      await waffle.deployContract(this.signers.admin, ERC165Caller, [erc165SingletonAddress])
    );

    console.log(await ethers.provider.getCode(erc165SingletonAddress));
  });

  shouldBehaveLikeERC165();
});
