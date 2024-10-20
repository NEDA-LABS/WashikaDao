# WashikaDao - Base Buildathon Project

## Overview

WashikaDao is a decentralized autonomous organization (DAO) designed to enable seamless governance and decision-making among a distributed community. The project was built to showcase the potential of decentralized governance using blockchain technology on the Base Sepolia testnet. This project demonstrates the ease of interacting with smart contracts using Foundry and Base’s testnet.

## Project Objective

The objective of WashikaDao is to facilitate decentralized decision-making where proposals are created, voted upon, and executed based on a token-governed system. The smart contracts ensure that the process is transparent, secure, and fully on-chain.

### Key Features
- Creating new DAO.
- Adding members on DAOs
- Create proposals and vote cast
- Execute changes

## Development Environment

**Tech Stack**:
- **Foundry**: Modular and fast Ethereum development framework
- **Anvil**: Local blockchain for rapid development
- **Base Sepolia Testnet**: Used for contract deployment and interaction testing

## Key Contracts

The smart contracts for WashikaDao are located in the [WashikaDao repository](https://github.com/NEDA-LABS/WashikaDao/tree/dev/sc) on the `dev/sc` branch. These include:

1. **FullDaoContract.sol**: this contract when deployed can create new DAO, add members on DAOS, create proposals and cast votes and execute the changes on chain, the changes may include transfer funds to and from the pool.

---

## Contract Deployment

### Prerequisites

Before deploying the contracts, ensure you have the following set up:
1. **Foundry** installed ([Installation guide](https://book.getfoundry.sh/getting-started/installation.html)).
2. A wallet with test ETH for gas fees on the Base Sepolia testnet.
3. **Anvil** for local testing (comes with Foundry).

### Step 1: Clone the Repository

Start by cloning the WashikaDao repository and switching to the development branch where the latest contracts are located:
```bash
git clone https://github.com/NEDA-LABS/WashikaDao.git
cd WashikaDao
git checkout dev
```
### Step 2: Install Foundry and Dependencies
Ensure you have Foundry installed. If not, install it using:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```
Install the necessary dependencies:
```
forge install
```

### Step 3: Start Anvil (for Local Testing)
You can simulate a blockchain locally using Anvil:
```bash
anvil
```
Anvil provides a local Ethereum environment where you can deploy and test contracts before using a testnet.

### Step 4: Compile Contracts
Before deploying, compile the contracts using Foundry's Forge tool:
```
forge compile
```

### Step 5: Deploy Contracts Locally (Anvil)
To deploy the contracts on Anvil (or a local blockchain), run the following:
```
forge script script/DaoContractDeployer.s.sol
```
You can obtain a private key from one of the funded accounts on Anvil. Make sure you note the contract address after deployment for interaction.

### Step 6: Deploy Contracts on Base Sepolia Testnet
For deploying on Base Sepolia Testnet, ensure you have test ETH in your wallet. You can use a faucet to get test ETH.

Deploy the contracts on Base Sepolia:
```
forge script script/DaoContractDeployer.s.sol --rpc-url $BASE_SEPOLIA_URL --private-key $PRIVATE_KEY --broadcast
```
You need a private key and base sepolia url to interact and sign tx successfully, add this variables in `.env` file as shown in `.envexample` file. You can interact with the contract after deployment using the address provided by the network from the terminal output. Ensure you save this contract address. The interactions are included in the scripts as well.

This script will allow you to:

Propose new actions
- Vote on proposals
- Execute actions once a proposal passes
- Contract Addresses (Base Sepolia)
The contract is deployed on the Base Sepolia testnet at address `0xA78949a0F0056508f26e6b75DE617E7d591873c9` see on [Basescan]("https://sepolia.basescan.org/address/0xA78949a0F0056508f26e6b75DE617E7d591873c9")

## How to Contribute

WashikaDao is an open-source project, and contributions are welcome! Developers can check out the `dev` branch to find the latest updates, experiment with features, or suggest enhancements. Contributions can be made by submitting pull requests, and discussions are encouraged via GitHub Issues. Having challenges feel free to reach out to our socials for inquiries.

### Contribution Guide:
1. **Fork the repository.**
2. **Create a new branch for your feature or bug fix.**
3. **Submit a pull request with your changes.**

## License

WashikaDao is licensed under the MIT License, making it free and open for the community to use and improve.

