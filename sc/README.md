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
