// components/SuperAdmin/TransactionPopup.tsx
import { useEffect, useState } from "react";
import { DaoDetails } from "./WanachamaList";
import { fetchEthToUsdRate } from "../../utils/priceUtils";

interface TransactionPopupProps {
  daoDetails?: DaoDetails;
}

interface TreasuryEntry {
  hash: string;
  type: "Withdraw" | "Deposit";
  date: string;
  amount: string; // e.g. "-0.123 ETH"
  value: string; // e.g. "$234.56"
  icon: string;
}

export default function TransactionPopup({
  daoDetails,
}: TransactionPopupProps) {
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);

  useEffect(() => {
    if (!daoDetails?.daoMultiSigAddr) return;
    (async () => {
      const address = daoDetails.daoMultiSigAddr;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const apiKey = import.meta.env.VITE_ARBISCAN_API_KEY;
      const url = `https://api-sepolia.arbiscan.io/api
        ?module=account
        &action=txlist
        &address=${address}
        &startblock=0
        &endblock=99999999
        &page=1
        &offset=8
        &sort=desc
        &apikey=${apiKey}`.replace(/\s+/g, "");

      const [rateRes, txRes] = await Promise.all([
        fetchEthToUsdRate(),
        fetch(url).then((r) => r.json()),
      ]);

      if (txRes.status !== "1") {
        setEntries([]);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parsed: TreasuryEntry[] = (txRes.result as any[]).map((tx) => {
        const eth = Number(tx.value) / 1e18;
        const usd = eth * rateRes;
        const isOut = tx.from.toLowerCase() === address.toLowerCase();

        return {
          hash: tx.hash,
          type: isOut ? "Withdraw" : "Deposit",
          date: new Date(Number(tx.timeStamp) * 1000).toLocaleDateString(),
          amount: `${isOut ? "-" : ""}${eth.toFixed(4)} ETH`,
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
          const txUrl = `https://sepolia.arbiscan.io/tx/${entry.hash}`;
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
