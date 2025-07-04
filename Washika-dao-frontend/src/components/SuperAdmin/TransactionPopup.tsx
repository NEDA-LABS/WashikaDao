import { useEffect, useState } from "react";
import { DaoDetails } from "./WanachamaList.js";
import { fetchTreasuryEntries, TreasuryEntry } from "../../utils/transactions.js";

interface TransactionPopupProps {
  daoDetails?: DaoDetails;
}

export default function TransactionPopup({ daoDetails }: TransactionPopupProps) {
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);

  useEffect(() => {
    if (!daoDetails?.daoMultiSigAddr) return;

    const fetchEntries = async () => {
      const address = daoDetails.daoMultiSigAddr.toLowerCase();
      try {
        const data = await fetchTreasuryEntries(address);
        setEntries(data);
      } catch (error) {
        console.error("Error fetching treasury entries:", error);
      }
    };

    fetchEntries();
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
        <p className="amount">
          {daoDetails?.kiwango.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          USD
        </p>
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
