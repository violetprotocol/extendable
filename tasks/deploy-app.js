require("@nomiclabs/hardhat-web3");

 module.exports = { 
     task: task("deploy_app", "Deploys a new instance of a specified App that will interact with an Extendable")
    .addParam("c", "The name of the contract wished to be deployed.")
    .addParam("e", "The address of the extendable contract that the App will interact with.")
    .setAction(async (taskArgs, hre) => {
        const Contract = await hre.ethers.getContractFactory(taskArgs.c);

        contract = await Contract.deploy(taskArgs.e);
        await contract.deployed();

        console.log(taskArgs.contract, "deployed to:", contract.address);
    })
}