/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/SafeWrapper.tsx
import React from "react";
import { SafeProvider, createConfig } from "@safe-global/safe-react-hooks";
import { ethers } from "ethers";

export const SafeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1️⃣ Ensure we have a browser wallet
  if (
    typeof window === "undefined" ||
    !(window as any).ethereum
  ) {
    return null; // not yet ready
  }

  // 2️⃣ Wrap the injected provider in ethers
  const web3Provider = new ethers.providers.Web3Provider(
    (window as any).ethereum as any,
    "any"
  );

  // 3️⃣ Grab the signer (user)
  const signer = web3Provider.getSigner();

  // 4️⃣ Build the Safe config, telling TS “trust me” with `as any`
  const safeConfig = createConfig({
    chain: 44787 as any,
    provider: (window as any).ethereum as any,     // EIP-1193
    signer: signer as any,                         // ethers.Signer
  }) as any;

  return <SafeProvider config={safeConfig}>{children}</SafeProvider>;
};
