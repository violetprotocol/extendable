require("@nomiclabs/hardhat-web3");

module.exports = {
    task: task("call_mock", "Calls a specified function of the MockLogicCaller contract")
    .addParam("c", "The contract address of the MockLogicCaller contract")
    .addParam("f", "The name of the function to be called to the Logic contract (test/fake/reverts)")
    .addParam("e", "The contract address of the extendable contract that will be called by the caller")
    .setAction(async (taskArgs, hre) => {
        const Extendable = await hre.ethers.getContractFactory("Extendable");
        const Caller = await hre.ethers.getContractFactory("MockLogicCaller");

        extendable = await Extendable.attach(taskArgs.e);
        caller = await Caller.attach(taskArgs.c);

        let callTx;
        switch(taskArgs.f) {
            case "test":
                callTx = await caller.callTest(extendable.address);
                break;
            case "fake":
                callTx = await caller.callFake(extendable.address);
                break;
            case "reverts":
                callTx = await caller.callReverts(extendable.address);
                break;

        }
        const res = await callTx.wait();

        console.log(res);
    })
}