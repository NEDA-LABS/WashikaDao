// utils/monthlyBalances.ts
import { RawTxn } from "./arbiscan.ts";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface MonthBucket {
  month: string;
  deposits: number;
  loans: number;
}

export async function computeMonthlyUsdHistory(
  address: string,
  rawTxns: RawTxn[],
  fetchCeloToUsdRate: () => Promise<number>
): Promise<MonthBucket[]> {
  const celoToUsd = await fetchCeloToUsdRate();

  // initialize months 0–11
  const buckets: MonthBucket[] = MONTH_LABELS.map((month) => ({
    month,
    deposits: 0,
    loans: 0,
  }));

  rawTxns.forEach((tx) => {
    const dt = new Date(tx.timestamp * 1000);
    const idx = dt.getMonth();
    const usd = tx.valueCelo * celoToUsd;
    if (tx.to.toLowerCase() === address.toLowerCase()) {
      // Incoming funds 
      buckets[idx].deposits += usd;
    } else if (tx.from.toLowerCase() === address.toLowerCase()) {
      // Outgoing funds 
      buckets[idx].loans += usd;
    }
  });
  return buckets;
}
