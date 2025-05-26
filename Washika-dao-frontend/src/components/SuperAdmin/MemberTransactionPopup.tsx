// components/SuperAdmin/MemberTransactionPopup.tsx
import { useEffect, useState } from "react";
import { TreasuryEntry, fetchTreasuryEntries } from "../../utils/transactions";
import { fetchCeloToUsdRate } from "../../utils/priceUtils";
import { useWalletBalance } from "thirdweb/react";
import { client } from "../../utils/thirdwebClient";
import { celoAlfajoresTestnet } from "thirdweb/chains";

interface MemberTransactionPopupProps {
  memberAddr: string;
}

export default function MemberTransactionPopup({
  memberAddr,
}: MemberTransactionPopupProps) {
  const [entries, setEntries] = useState<TreasuryEntry[]>([]);
  const [usdBal, setUsdBal] = useState<number>();

  const { data: balanceData, isLoading } = useWalletBalance({
    address: memberAddr || "",
    client,
    chain: celoAlfajoresTestnet,
  });

  useEffect(() => {
    if (!memberAddr) return;

    (async () => {
      const address = memberAddr.toLowerCase();
      const entries = await fetchTreasuryEntries(address);
      setEntries(entries);
    })();
  }, [memberAddr]);

  useEffect(() => {
    const convertToUsd = async () => {
      if (!balanceData) return;
      const celoBal = parseFloat(balanceData.displayValue);
      const rate = await fetchCeloToUsdRate();
      setUsdBal(celoBal * rate);
    };

    convertToUsd();
  }, [balanceData]);

  if (!balanceData || isLoading) {
    return <div>Loading balance...</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="treasury-history">
        <h1>Transaction History</h1>
        <p style={{ padding: "1rem" }}>No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="treasury-history">
      <div className="balance">
        <h1>Treasury Balance</h1>
        <p className="amount">
          {usdBal?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{" "}
          USD
        </p>
      </div>
      <h2>Member Transaction History</h2>
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
