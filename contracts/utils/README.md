# Utils

In this package, Extendable utility contracts live.

In the Extendable paradigm, utility contracts are those that augment, aid and support your Extension development. They are inherited by your Extensions that require the specific utilities provided by them. These are usually in the form of modifiers or helper functions.

Our main utilities are:

* CallerContext
* Reentrancy Guard
* Internal

## Caller Context

Caller contexts record the current caller of the execution in any part of the callchain. Normally this is easily handled by the `msg.sender` global variable which returns the sender of the current message, the last external caller. However due to the Extendable framework and our usage of dispersed Extensions, cross-Extension calls are actually registered as external calls. This means that if a transaction that originates from some external source, and calls another internal function, the sender will be registered as the internal contract.

In this example callchain:
`EOA -> contract.functionA -> contract.functionB`
where `functionA` and `functionB` live in separate Extensions, the `msg.sender` in `functionA` is `EOA` but the `msg.sender` in `functionB` is `contract`. In traditional smart contracts, functions `A` and `B` would live in the same contract and thus this internal call would not constitute an external call that rewrites the `msg.sender`.

The CallerContext contract provides two functions:
* `_lastExternalCaller` which returns a reference to the last caller of the contract that originated outside of this contract
* `_lastCaller` which returns a reference to the caller of this function, similar to `msg.sender` but indexed through a recorded callchain

The `Extendable` contract itself records the callchain as functions are called. Calling either of the above functions in your Extensions will provide you the exact caller in the current context.

## Reentrancy Guard

Re-entrancy can take various forms as its intent has always been to prevent unintended behaviour through re-entering code during mid-execution which could cause vulnerabilities. In the Extendable framework, due to the potential of cross-Extension calls where Extensions can be added and removed, it raises the risk of unpredictable behaviour as a composability problem; you cannot be entirely sure how other Extensions may behave if new ones are added in the future or functional logic is updated. To account for the greater degrees of potential vulnerabilities we have modelled various different modes of re-entry and designed guards against all types.

* Function-specific re-entrancy
* Contract external re-entrancy
* Absolute re-entrancy

### Function-specific Re-entrancy

This form of re-entrancy describes the calling of a given function and within the same callstack, re-entering the same function.

The guard prevents re-entry to the same function during a call in which the same function has not completed execution. This guard is the `nonReentrant` modifier.

### Contract external re-entrancy

This form of re-entrancy describes the calling of any function of a contract that originates from outside the contract more than once in the same callstack. 

The guard prevents execution if a contract function is called by an EOA, and before the execution exits this function, the callstack leaves this contract context and attempts to re-enter through any other function. This guard is the `externalNonReentrant` modifier.

In this case, the contract can make any number of internal, cross-Extension calls or regular internal calls, but if the execution leaves the contract and at some other point in time in the callstack, attempts to call another function of this contract, the guard rejects the execution.

### Absolute re-entrancy

This form of re-entrancy describes the calling of any function of a contract from any source in the same callstack.

The guard prevents re-entry to any modified function that is called if any other function in the contract has already been called regardless of source. This guard is the `strictNonReentrant` modifier.

```solidity
contract YourContract is ReentrancyGuard {
    function atomic() nonReentrant {}
    function internal() externalNonReentrant {}
    function strict() strictNonReentrant {}
}
```

## Internal

The Internal contract is used by `InternalExtension` which should be inherited by your Extension to create Extensions that house functions that should only be callable by other Extensions of your contract.

You can use this explicitly in any of your contracts but the functionality will not differ from `InternalExtension` and its benefits are only usable with Extensions.

Provides a `_internal` modifier that marks functions as internal to an Extendable contract, allowing all Extensions of a contract to be able to call it but excludes external contracts from calling it.

```solidity
contract YourExtension is InternalExtension {}
```

```solidity
contract YourContract is Internal {}
```

Internal functions are now internal to only the Extendable contract and all Extensions it has. Your function must be marked as follows:

`function yourFunction() public _internal {}`

with both `public` and `_internal` modifiers. This is due to the external nature of cross-Extension calls where its visibility must be made public for it to be visible outside of the Extension itself but only visible by other Extensions of the current Extendable contract.