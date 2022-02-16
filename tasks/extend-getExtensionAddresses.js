require("@nomiclabs/hardhat-web3");

 module.exports = { 
     task: task("get_extensions", "Get all extensions of an extendable")
    .addParam("e", "The target contract")
    .setAction(async (taskArgs, hre) => {
        const Extendable = await hre.ethers.getContractFactory("ExtendLogic");
        const extendable = await Extendable.attach(taskArgs.e);

        const addresses = await extendable.callStatic.getExtensionAddresses();
        console.log(addresses);
    })
}