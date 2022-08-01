module.exports = {
    EIP165_INTERFACE: "0x01ffc9a7",
    BASE_EXTENSION_INTERFACE: "0xe74891b2",
    EXTEND: {
        INTERFACE: "0xa501cf1f",
        SELECTORS: [
            "0x82005715",
            "0xa9cf0ea9",
            "0x0d794dc0",
            "0x83b7db63"
        ]
    },
    PERMISSIONING: {
        INTERFACE: "0xe0f6c5f3",
        SELECTORS: [
            "0xe1c7392a",
            "0x880cdc31",
            "0x893d20e8"
        ]
    },
    RETRACT_LOGIC_INTERFACE: "0xf9fb51c8",
    REPLACE_LOGIC_INTERFACE: "0x631de4d6",
    REGISTER_LOGIC_INTERFACE: "0x32434a2e",
    DEPLOY_LOGIC_INTERFACE: "0x0570b1fa",
    TOKEN_LOGIC_INTERFACE: "0x40c10f19",
    STORAGE_GETTER_LOGIC_INTERFACE: "0xa75cdf14",
    MOCK_LOGIC_INTERFACE: "0xc36446a4",
    MOCK_CALLER_CONTEXT_INTERFACE: "0x26cbf720",
    MOCK_DEEP_CALLER_CONTEXT_INTERFACE: "0xf9413ffd",
    MOCK_REENTRANCY_INTERFACE: "0x7a2f6ac8",
    MOCK_INTERNAL_EXTENSION_INTERFACE: "0x9cb4ac6e",
    singletonFactoryDeploymentTx: "0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470",
    singletonFactoryDeployer: "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D",
    singletonFactoryAddress: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    erc165SingletonAddress: "0x99576C1caF6bFc959a1190418027E6F09380d384",
    factoryABI: [
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
}