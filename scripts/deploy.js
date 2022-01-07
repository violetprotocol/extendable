// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const Extendable = await ethers.getContractFactory("Extendable");
  const Logic = await ethers.getContractFactory("MockLogic");
  const Caller = await ethers.getContractFactory("MockLogicCaller");

  extendable = await Extendable.deploy();
  logic = await Logic.deploy();
  caller = await Caller.deploy();

  await extendable.deployed();
  await logic.deployed();
  await caller.deployed();

  console.log("Extendable deployed to:", extendable.address);
  console.log("Logic deployed to:", logic.address);
  console.log("Caller deployed to:", caller.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
