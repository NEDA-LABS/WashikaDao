// components/SuperAdmin/TransactionPopup.tsx
import { useEffect, useState } from "react";
import { DaoDetails } from "./WanachamaList";
import { fetchCeloToUsdRate } from "../../utils/priceUtils";
import { fetchTokenTransfers, RawTxn } from "../../utils/arbiscan";

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

      const unique = parsed
        .filter(
          (entry, idx, arr) =>
            idx ===
            arr.findIndex((e) => e.hash === entry.hash && e.type === entry.type)
        )
        .sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

      setEntries(unique);
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
      <div className="balance">
        <h1>Treasury Balance</h1>
        <p className="amount">{daoDetails?.kiwango.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD</p>
      </div>
      <h2>Treasury History</h2>
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
