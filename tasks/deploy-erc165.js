const { factoryABI, singletonFactoryAddress, erc165Bytecode, erc165DeploymentSalt } = require("../test/utils/constants");

require("@nomiclabs/hardhat-web3");

// Deploys an ERC165 standalone singleton at deterministic address 0x16C940672fA7820C36b2123E657029d982629070
module.exports = { 
     task: task("deploy:erc165", "Deploys a new instance of an erc165Logic contract")
    .setAction(async (taskArgs, hre) => {
        const signer = (await hre.ethers.getSigners())[0];

        // Uncomment these lines if the ERC165Logic implementation has changed
        // const Contract = await hre.ethers.getContractFactory("ERC165Logic");
        // const deploymentTx = await Contract.getDeployTransaction();

        const Factory = new hre.ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, signer);
        const factory = await Factory.attach(singletonFactoryAddress);

        const tx = await factory.deploy(erc165Bytecode, erc165DeploymentSalt, { gasLimit: "0x07A120" });
        const receipt = await tx.wait();
        console.log(receipt.transactionHash);
    })
}