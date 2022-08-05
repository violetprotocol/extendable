interface Interface {
  interface: string;
  selectors: string[];
}

export const EIP165_INTERFACE: string = "0x01ffc9a7";
export const BASE_EXTENSION_INTERFACE: string = "0xef0838e2";

export const MOCK_EXTENSION: Interface = {
  interface: "0xc36446a4",
  selectors: ["0xf8a8fd6d", "0x3bccbbc9"],
};

export const EXTEND: Interface = {
  interface: "0x23001c73",
  selectors: ["0x82005715", "0xa9cf0ea9", "0x1a946137", "0x1f226938", "0x0d794dc0"],
};

export const PERMISSIONING: Interface = {
  interface: "0xe0f6c5f3",
  selectors: ["0xe1c7392a", "0x880cdc31", "0x893d20e8"],
};

export const RETRACT: Interface = {
  interface: "0xf9fb51c8",
  selectors: ["0xf9fb51c8"],
};

export const REPLACE: Interface = {
  interface: "0x631de4d6",
  selectors: ["0x631de4d6"],
};

export const MOCK_CALLER_CONTEXT: Interface = {
  interface: "0x26cbf720",
  selectors: ["0x7504bc70", "0x31f689cb", "0x6239c29b"],
};

export const MOCK_DEEP_CALLER_CONTEXT: Interface = {
  interface: "0xf9413ffd",
  selectors: ["0x878002ad", "0x1b16549d", "0x65d769cd"],
};

export const MOCK_REENTRANCY: Interface = {
  interface: "0x7a2f6ac8",
  selectors: [
    "0xbd34163a",
    "0x40a6ca6b",
    "0xf8a394b9",
    "0x854b9fb7",
    "0x8363056e",
    "0xb55029a1",
    "0x5996cb4b",
    "0x75bddba4",
    "0x6805ebcc",
    "0x35a36710",
    "0x429e1628",
    "0x72af5122",
    "0x4fea77d1",
    "0x4bbe768a",
    "0x0fe33704",
    "0xa2a2e7ff",
    "0x93dae603",
    "0xca55ae3d",
    "0x4b4e046f",
    "0x18059a19",
    "0x3091f909",
    "0xcea3b1d4",
    "0xfbc158b2",
    "0x067595a8",
    "0x7162cd34",
    "0x7f0f9252",
    "0x23e09728",
  ],
};

export const MOCK_INTERNAL_EXTENSION: Interface = {
  interface: "0x9cb4ac6e",
  selectors: ["0x8701f8ca", "0x1bb554a4"],
};

export const singletonFactoryDeploymentTx: string =
  "0xf9016c8085174876e8008303c4d88080b90154608060405234801561001057600080fd5b50610134806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80634af63f0214602d575b600080fd5b60cf60048036036040811015604157600080fd5b810190602081018135640100000000811115605b57600080fd5b820183602082011115606c57600080fd5b80359060200191846001830284011164010000000083111715608d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550509135925060eb915050565b604080516001600160a01b039092168252519081900360200190f35b6000818351602085016000f5939250505056fea26469706673582212206b44f8a82cb6b156bfcc3dc6aadd6df4eefd204bc928a4397fd15dacf6d5320564736f6c634300060200331b83247000822470";
export const singletonFactoryDeployer: string = "0xBb6e024b9cFFACB947A71991E386681B1Cd1477D";
export const singletonFactoryAddress: string = "0xce0042B868300000d44A59004Da54A005ffdcf9f";
export const erc165SingletonAddress: string = "0x99576C1caF6bFc959a1190418027E6F09380d384";
export const factoryABI: any = [
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes",
        name: "_initCode",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "_salt",
        type: "bytes32",
      },
    ],
    name: "deploy",
    outputs: [
      {
        internalType: "address payable",
        name: "createdContract",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
