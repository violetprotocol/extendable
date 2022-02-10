# Releasing

To cut a new release, first create a pull request from `dev` into `main` with the [semver](https://semver.org/) naming convention. For example `1.0.0.-rc1`. This will enter wider team review and further testing where necessary to ensure bug-free code and presentableness to public.

## Testing

Run tests and coverage:
```bash
$ yarn test
$ yarn coverage
```

Manual testing using hardhat tasks and public testnets are encouraged.

Mock development by using the library is also encouraged (or the use of bug bounties).

## Preparing for NPM

Enter the contracts directory:

```bash
$ cd contracts
```

Test the npm package with by:
```bash
$ yarn pack
```
Ensure the resulting tarball includes all files that you expect the package to have.

Then create a new folder with a test project and install your package:
```bash
$ mkdir test-project
$ cd test-project
$ npm init
$ npm install <path/to/contractsdir>
```
The package should now be installed in your project's `node_modules` and the contracts should be accessible through imports `import "@violetprotocol/extendable/extendable/Extendable.sol";`

## Merge and Release

Once checks and reviews pass, the release can be merged to `main` and then tagged with the normal release number without the release candidate tagging e.g. `1.0.0`.

Then perform the publishing step to npm:

```bash
$ cd contracts
$ yarn prepare
$ npm login --scope=@violetprotocol
$ npm publish --access public --tag <version>
```

Ensure that the tag includes a changelog that documents the feature changes/additions/fixes that were included in the version that diff from the previous release.