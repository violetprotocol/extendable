require("@nomiclabs/hardhat-web3");

 module.exports = { 
     task: task("replace", "Replace an extendable extension with a new extension")
    .addParam("t", "The target contract to be extended")
    .addParam("o", "The old contract address of the extension contract that will be removed")
    .addParam("n", "The new contract address of the extension contract that will be added")
    .setAction(async (taskArgs, hre) => {
        const Extendable = await hre.ethers.getContractFactory("ReplaceLogic");
        const extendable = await Extendable.attach(taskArgs.t);

        const replaceTx = await extendable.replace(taskArgs.o, taskArgs.n);
        const res = await replaceTx.wait();

        console.log(res);
    })
}