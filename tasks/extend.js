require("@nomiclabs/hardhat-web3");

 module.exports = { 
     task: task("extend", "Extend an extendable contract with a specified extension")
    .addParam("t", "The target contract to be extended")
    .addParam("e", "The contract address of the extension contract that will be added")
    .setAction(async (taskArgs, hre) => {
        const Extendable = await hre.ethers.getContractFactory("ExtendLogic");

        const extendable = await Extendable.attach(taskArgs.t);

        const extendTx = await extendable.extend(taskArgs.e);
        const res = await extendTx.wait();

        console.log(res);
    })
}