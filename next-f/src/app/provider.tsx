"use client";

import { ThirdwebProvider } from "@thirdweb-dev/react";

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
};
