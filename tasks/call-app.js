require("@nomiclabs/hardhat-web3");

module.exports = {
    task: task("call_app", "Calls a specified function of the Caller contract")
    .addParam("c", "The contract address of the Caller contract")
    .addParam("f", "The name of the function to be called to the Logic contract (issue/issueTo/revoke/expire)")
    .setAction(async (taskArgs, hre) => {
        [account] = await hre.ethers.getSigners();
        const Caller = await hre.ethers.getContractFactory("Caller");

        caller = await Caller.attach(taskArgs.c);

        let callTx;
        switch(taskArgs.f) {
            case "issue":
                callTx = await caller.callIssue();
                break;
            case "issueTo":
                callTx = await caller.callIssueTo(account.address);
                break;
            case "revoke":
                callTx = await caller.callRevoke(account.address);
                break;
            case "expire":
                callTx = await caller.callExpire();
                break;
            default:
                throw Error("unrecognised function")

        }
        const res = await callTx.wait();

        console.log(res);
    })
}