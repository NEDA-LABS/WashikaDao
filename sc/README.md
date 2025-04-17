## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
### Smart Contract Access page: Deployed on holesky as we wait for Celo to stabilize after L2 transition
```forge create --rpc-url "ethereum-holesky" --private-key "${CELO_PRIVATE_KEY}" --verifier-url "https://api-holesky.etherscan.io/api" -e "${ETHERSCAN_API_KEY}" --verify src/FullDaoContract.sol:FullDaoContract ```
[⠑] Compiling...
No files changed, compilation skipped
Deployer: 0xfdF57a59Bc3e63a56de4682a53D57371518c7A48
Deployed to: 0xffd26D80A70DCC05E5b0FcD57B6C104e507f8b75
Transaction hash: 0x964e7f17cbdf3a35175f786a6045d53638ed12dc3cfdce18679fa3606c240c30
Starting contract verification...
Waiting for etherscan to detect contract deployment...
Start verifying contract `0xffd26D80A70DCC05E5b0FcD57B6C104e507f8b75` deployed on holesky

Submitting verification for [src/FullDaoContract.sol:FullDaoContract] 0xffd26D80A70DCC05E5b0FcD57B6C104e507f8b75.
Submitted contract for verification:
	Response: `OK`
	GUID: `p8hdkdsudaurzigd9iyqded5zvyji95ewqmefjqurqfmzg71s8`
	URL: https://holesky.etherscan.io/address/0xffd26d80a70dcc05e5b0fcd57b6c104e507f8b75
Contract verification status:
Response: `NOTOK`
Details: `Pending in queue`
Contract verification status:
Response: `OK`
Details: `Pass - Verified`
Contract successfully verified

### V1 Smart Contract Access: Deployed on Celo Alfajores to allow for testing before mainnet migration.  
Verified Contract on Sourcify: https://repo.sourcify.dev/44787/0x52992bf84D4cEdae1d5b69155802dB107b2Ee8dD 
Link to the Integration Functions: https://thirdweb.com/celo-alfajores-testnet/0x52992bf84D4cEdae1d5b69155802dB107b2Ee8dD/explorer?selector=0x6e2a2f5e 
You may have noticed from the above urls that the contract address is: 0x52992bf84d4cedae1d5b69155802db107b2ee8dd 
The transaction Hash: 0x3e8a4a5397c65ef9a2dc417cb06ac64f720a25f043a4f47e6890fe7afd28922f

