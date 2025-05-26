// utils/transactions.ts
import { fetchCeloToUsdRate } from "./priceUtils";
import { fetchTokenTransfers, RawTxn } from "./arbiscan";

export interface TreasuryEntry {
  hash: string;
  type: "Withdraw" | "Deposit";
  date: string;
  amount: string;
  value: string;
  icon: string;
}

export const fetchTreasuryEntries = async (address: string): Promise<TreasuryEntry[]> => {
  const [rateRes, tokenTxns] = await Promise.all([
    fetchCeloToUsdRate(),
    fetchTokenTransfers(address),
  ]);

  const nonZero = tokenTxns.filter(
    (tx) =>
      tx.valueCelo >= 0.1 &&
      (tx.from.toLowerCase() === address || tx.to.toLowerCase() === address)
  );

  const parsed: TreasuryEntry[] = nonZero.map((tx: RawTxn) => {
    const isOut = tx.from.toLowerCase() === address;
    const usd = tx.valueCelo * rateRes;

    return {
      hash: tx.hash,
      type: isOut ? "Withdraw" : "Deposit",
      date: new Date(Number(tx.timestamp) * 1000).toLocaleDateString(),
      amount: `${isOut ? "-" : ""}${tx.valueCelo.toFixed(2)} CELO`,
      value: `$${usd.toFixed(2)}`,
      icon: isOut ? "/images/withdrawIcon.png" : "/images/deposit.png",
    };
  });

  return parsed
    .filter(
      (entry, idx, arr) =>
        idx === arr.findIndex((e) => e.hash === entry.hash && e.type === entry.type)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
