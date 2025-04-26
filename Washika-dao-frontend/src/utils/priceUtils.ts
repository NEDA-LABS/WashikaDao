export async function fetchCeloToUsdRate(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd"
    );
    const data = await res.json();
    return data.celo.usd;
  } catch (err) {
    console.error("Error fetching CELO→USD rate", err);
    return 0;
  }
}
