export async function fetchEthToUsdRate(): Promise<number> {
    try {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await res.json();
      return data.ethereum.usd;
    } catch (err) {
      console.error("Error fetching ETH→USD rate", err);
      return 0;
    }
  }
  