require("@nomiclabs/hardhat-web3");

 module.exports = { 
     task: task("deploy", "Deploys a new instance of a specified constructorless contract")
    .addParam("c", "The name of the contract wished to be deployed. This task only handles for constructorless/parameterless constructor deployments.")
    .setAction(async (taskArgs, hre) => {
        const Contract = await hre.ethers.getContractFactory(taskArgs.c);

        contract = await Contract.deploy();
        await contract.deployed();

        console.log(taskArgs.c, "deployed to:", contract.address);
    })
}