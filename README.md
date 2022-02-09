# Extendable Contract Pattern

Upgradeable, modular, extensible smart contracts using Extendable<>Extension architecture.

Add and remove selectively modular parts of functional logic known as Extensions, accessing modular storage definitions.

```solidity
contract YourContract is Extendable {
    ...
}
```

```solidity
YourContract.extend(extension);
```

## Architecture

Contracts are given their functionality by _extending_ them with new functions. The first function that is added is the _Extend_ function which provides the contract the ability to be extended.

### Extendable

All contracts must inherit the _Extendable_ contract.

_Extendable_ contracts have a unique interaction with the _ExtendLogic_ contract where Extensions are added. _Extendable_ contracts access the state written by the _ExtendLogic_ extension in order to perform delegate calls to each extension. All calls are done from the context of the _Extendable_ contract which is handled by `delegatecall`.

_Extendable_ contracts have an evolving interface which is accessible through the `getCurrentInterface` function supplied by the _ExtendLogic_ extension. This allows developers to easily determine the current interface of an evolving _Extendable_ contract directly on-chain without having to query separate processes that may not be in sync (GitHub, Documentation, Twitter etc.).

### Extensions

_Extension_ logic contracts implement functional logic that is called by the _Extendable_ contract. Following extension principles of modularity and updateability, it is recommended to separate logic contracts into the most divisible units possible: single function contracts. Where logic contracts encompass more than a single function for dependency or cohesive reasons, it can envelope more functions but with the trade-off of being less modular; any upgrades to a single function require the entire logic extension to be updated and re-registered.

_Extension_ logic contracts can mutate state by accessing the storage of the delegator through custom storage slot access. Various different _Extension_ logic contracts can access the same state but extensions should be written and extended mindfully to avoid incorrect state mutability.

### Storage

_Storage_ contracts define state variables that intend to be stored and used by an _Extendable_ contract and accessed by _Extension_ logic contracts. It uses a storage slot locator model where storage is allocated and accessed by address and different structures/types are located in different places to avoid collision.

_Storage_ contracts are libraries that are imported by the contract that requires access to storage state. These contracts can include reusable functions that might be useful related to computation over state (such as modifiers or _get_ functions).

## Requirements

`nodejs >=12.0`

## Build

`yarn install` to install all dependencies.

`yarn hardhat compile` to build all contract artifacts.

## Test

`yarn hardhat test` to run tests.
