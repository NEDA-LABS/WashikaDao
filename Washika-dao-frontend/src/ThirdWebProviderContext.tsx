import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

const ThirdwebContext = createContext();

export const useThirdweb = () => useContext(ThirdwebContext);

export const ThirdwebProviderContext = ({ children, chainId, supportedChainIds }) => {
  const [sdk, setSdk] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const newSdk = new ThirdwebSDK({
          chainId: chainId,
          supportedChainIds: supportedChainIds,
        });

        await newSdk.wallet.connect();
        const connectedAddress = await newSdk.wallet.getAddress();

        setSdk(newSdk);
        setAddress(connectedAddress);
      } catch (error) {
        console.error("Failed to initialize thirdweb SDK:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSDK();
  }, [chainId, supportedChainIds]);

  const value = {
    sdk,
    address,
    loading,
  };

  return (
    <ThirdwebContext.Provider value={value}>
      {children}
    </ThirdwebContext.Provider>
  );
};

export default ThirdwebProviderContext;