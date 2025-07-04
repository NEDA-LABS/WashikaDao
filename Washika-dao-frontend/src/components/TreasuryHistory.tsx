import React, { useEffect, useState } from "react";
import { fetchCeloToUsdRate } from "../utils/priceUtils.js";
import { fetchTokenTransfers, RawTxn } from "../utils/arbiscan.js";
import { DaoDetails } from "../pages/DaoProfile.js";
import TransactionPopup from "./SuperAdmin/TransactionPopup.js";

interface TreasuryEntry {
  hash: string;
  type: "Withdraw" | "Deposit";
  date: string;
  amount: string;
  value: string;
  icon: string;
}

interface TreasuryHistoryProps {
  daoDetails: DaoDetails;
  daoMultiSigAddr: string;
  limit?: number; // how many to show in mini‐statement
}

const TreasuryHistory: React.FC<TreasuryHistoryProps> = ({
  daoDetails,
  daoMultiSigAddr,
  limit = 5,
}) => {
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStatement, setShowStatement] = useState(false);

  useEffect(() => {
    if (!daoMultiSigAddr) return;

    (async () => {
      const address = daoMultiSigAddr.toLowerCase();
      const [rate, raw] = await Promise.all([
        fetchCeloToUsdRate(),
        fetchTokenTransfers(address),
      ]);

      // filter out zero‐value and keep only send/receive
      const filtered = (raw as RawTxn[]).filter(
        (tx) =>
          tx.valueCelo >= 0.1 &&
          (tx.from.toLowerCase() === address || tx.to.toLowerCase() === address)
      );

      // map → UI model
      const parsed: TreasuryEntry[] = filtered.map((tx) => {
        const isOut = tx.from.toLowerCase() === address;
        const usd = tx.valueCelo * rate;
        return {
          hash: tx.hash,
          type: isOut ? "Withdraw" : "Deposit",
          date: new Date(tx.timestamp * 1000).toLocaleDateString(),
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
          // parse a.date/b.date back to timestamps if you need an exact sort
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

      setEntries(unique.slice(0, limit));
      setLoading(false);
    })();
  }, [daoMultiSigAddr, limit]);

  if (loading) {
    return <div>Loading treasury history…</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="treasury-history">
        <h1>Mini Statement</h1>
        <p style={{ padding: "1rem" }}>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="treasury-history">
      <h1>Mini Statement</h1>
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
      <div className="history-button">
        <button onClick={() => setShowStatement(true)}>Full Statement</button>
      </div>
      {showStatement && (
        <div className="modal-overlay" onClick={() => setShowStatement(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <TransactionPopup
              daoDetails={{
                ...daoDetails,
                daoId: daoDetails.daoId! as `0x${string}`, // assert it's there & hex
              }}
            />
            <button
              onClick={() => setShowStatement(false)}
              className="close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreasuryHistory;
