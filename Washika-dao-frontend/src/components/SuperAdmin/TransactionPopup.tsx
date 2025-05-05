// components/SuperAdmin/TransactionPopup.tsx
import { useEffect, useState } from "react";
import { DaoDetails } from "./WanachamaList";
import { fetchCeloToUsdRate } from "../../utils/priceUtils";
import { fetchAllTransactions, RawTxn } from "../../utils/arbiscan";

interface TransactionPopupProps {
  daoDetails?: DaoDetails;
}

interface TreasuryEntry {
  hash: string;
  type: "Withdraw" | "Deposit";
  date: string;
  amount: string;
  value: string;
  icon: string;
}

export default function TransactionPopup({
  daoDetails,
}: TransactionPopupProps) {
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);

  useEffect(() => {
    if (!daoDetails?.daoMultiSigAddr) return;
    (async () => {
      const address = daoDetails.daoMultiSigAddr.toLowerCase();

      const [rateRes, rawTxns] = await Promise.all([
        fetchCeloToUsdRate(),
        fetchAllTransactions(address),
      ]);

      const nonZero = rawTxns.filter(tx =>
        !tx.isInternal &&
        tx.valueCelo !== 0 &&
        (tx.from.toLowerCase() === address || tx.to.toLowerCase() === address)
      );

      const parsed: TreasuryEntry[] = nonZero.map((tx: RawTxn) => {
        const isOut = tx.from.toLowerCase() === address;
        const usd = tx.valueCelo * rateRes;

        return {
          hash: tx.hash,
          type: isOut ? "Withdraw" : "Deposit",
          date: new Date(Number(tx.timestamp) * 1000).toLocaleDateString(),
          amount: `${isOut ? "-" : ""}${tx.valueCelo.toFixed(4)} CELO`,
          value: `$${usd.toFixed(2)}`,
          icon: isOut ? "/images/withdrawIcon.png" : "/images/deposit.png",
        };
      });

      setEntries(parsed);
    })();
  }, [daoDetails]);

  if (entries.length === 0) {
    return (
      <div className="treasury-history">
        <h1>Full Statement</h1>
        <p style={{ padding: "1rem" }}>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="treasury-history">
      <h1>Full Statement</h1>
      <div id="treasury-history">
        {entries.map((entry) => {
          const txUrl = `https://explorer.celo.org/alfajores/tx/${entry.hash}`;
          return (
            <a
              key={entry.hash}
              href={txUrl}
              target="_blank"
              rel="noreferrer"
              className="slot"
            >
              <div className="left">
                <img
                  src={entry.icon}
                  alt={`${entry.type} icon`}
                  width="27"
                  height="29"
                />
                <div>
                  <h1>{entry.type}</h1>
                  <p>{entry.date}</p>
                </div>
              </div>
              <div className="right">
                <div className="state-right">
                  <p className="topy">{entry.amount}</p>
                  <p className="bottom">{entry.value}</p>
                </div>
                <img src="/images/expand.png" alt="expand icon" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
