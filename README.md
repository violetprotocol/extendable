# Extendable Contract Pattern

Upgradeable, modular, extensible smart contracts using Extendable<>Extension architecture.

Add and remove selectively modular parts of functional logic known as Extensions, accessing modular storage definitions.

```solidity
import "@violetprotocol/extendable/extendable/Extendable.sol";

contract YourContract is Extendable {
    ...
}
```

```
> deploy(YourContract)
> YourContract.extend(extension);
```

### Get started!

Simply install our package and get implementing!

```bash
npm install @violetprotocol/extendable
```

```bash
yarn add @violetprotocol/extendable
```

Then import our library during development:

```solidity
import "@violetprotocol/extendable/extendable/Extendable.sol";
import "@violetprotocol/extendable/extensions/Extension.sol";
import "@violetprotocol/extendable/extensions/extend/ExtendLogic.sol";
import "@violetprotocol/extendable/storage/ExtendableStorage.sol";
...
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

```solidity
import "@violetprotocol/extendable/extensions/Extension.sol";

contract YourExtension is IYourExtension, Extension {
    ...
}
```

```
> deploy(YourExtension)
0x7F5b1b0a4929BF2bD9502CBF714c166931FC85dD
> YourContract.extend(0x7F5b1b0a4929BF2bD9502CBF714c166931FC85dD)
```

### Storage

_Storage_ contracts define state variables that intend to be stored and used by an _Extendable_ contract and accessed by _Extension_ logic contracts. It uses a storage slot locator model where storage is allocated and accessed by address and different structures/types are located in different places to avoid collision.

_Storage_ contracts are libraries that are imported by the contract that requires access to storage state. These contracts can include reusable functions that might be useful related to computation over state (such as modifiers or _get_ functions).

```solidity
struct YourState {
    // State variables are declared here
}

library YourStorage {
    bytes32 constant private STORAGE_NAME = keccak256("your_unique_storage_identifier");

    function _getStorage()
        internal 
        view
        returns (YourState storage state) 
    {
        bytes32 position = keccak256(abi.encodePacked(address(this), STORAGE_NAME));
        assembly {
            state.slot := position
        }
    }
}
```

```solidity
import "@violetprotocol/extendable/extensions/Extension.sol";
import "./YourStorage.sol";

contract YourExtension is IYourExtension, Extension {
    function readStorage() public view {
        YourState storage state = YourStorage._getStorage();

        // access properties of state with `state.yourVar`
        // re-assign state properties with `state.yourVar = <value>`
    }
}
```

## Requirements

`nodejs >=12.0`

## Build

`yarn install` to install all dependencies.

`yarn hardhat compile` to build all contract artifacts.

## Test

`yarn hardhat test` to run tests.
