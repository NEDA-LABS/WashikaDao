import { createPublicClient, createWalletClient, custom, getContract, http } from "viem";
import { celoAlfajores, mainnet } from "viem/chains";
import { wagmiAbi } from "../utils/contractAbi/abi";
import { privateKeyToAccount } from "viem/accounts";

import dotenv from 'dotenv';

dotenv.config();

const account = privateKeyToAccount('0xb7faa7f978c75808482f0c80123ea2ea26896a5c476ac0aac861dc033c9b1bd3');

export const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(process.env.API_URL),
})

export const walletClient = createWalletClient({
  account,
  chain: celoAlfajores,
  transport: http(process.env.API_URL),
})


/*
 * The Most important thing is that here, we will set up the contract instance so we can interact with our contract from wherever we import this file from
 */

export const daoContract = getContract({
  address: '0x8EC4eE1A1aEccE5Df1a630ea50Aa9716549cE9Ff', //contract address
  abi: wagmiAbi,
  client: {
    public: publicClient,
    wallet: walletClient,
  }
})
