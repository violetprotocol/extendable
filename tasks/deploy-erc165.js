const { default: Common, Chain, Hardfork } = require("@ethereumjs/common");
const { FeeMarketEIP1559Transaction, Transaction } = require("@ethereumjs/tx");
const { bufArrToArr, bigIntToUnpaddedBuffer, bigIntToBuffer } = require("@ethereumjs/util");
const { keccak256 } = require("@ethersproject/keccak256");
const { BN } = require("bn.js");
const { recoverAddress } = require("ethers/lib/utils");
const { default: RLP } = require("rlp");

require("@nomiclabs/hardhat-web3");

const factoryAddress = "0xce0042B868300000d44A59004Da54A005ffdcf9f";

// Deploys an ERC165 standalone singleton at deterministic address 0x23a6e4d33cff52f908f3ed8f7e883d2a91a4918f
module.exports = { 
     task: task("deploy:erc165", "Deploys a new instance of an erc165Logic contract")
    .setAction(async (taskArgs, hre) => {
        const signer = (await hre.ethers.getSigners())[0];

        const Contract = await hre.ethers.getContractFactory("ERC165Logic");
        const deploymentTx = await Contract.getDeployTransaction();

        const Factory = new hre.ethers.Contract("0x0000000000000000000000000000000000000000", factoryABI, signer);
        const factory = await Factory.attach(factoryAddress);
        
        const tx = await factory.deploy(deploymentTx.data, "0x0000000000000000000000000000000000000000000000000000000000000000", { gasLimit: "0x07A120" });
        const receipt = await tx.wait();
        console.log(receipt.transactionHash);
    })
}

const factoryABI = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes",
                "name": "_initCode",
                "type": "bytes"
            },
            {
                "internalType": "bytes32",
                "name": "_salt",
                "type": "bytes32"
            }
        ],
        "name": "deploy",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "createdContract",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]