import React, { useEffect, useState, useMemo } from "react";
import Balance from "./Balance";
import {
  computeMonthlyUsdHistory,
  MonthBucket,
} from "../utils/monthlyBalances";
import { fetchTokenTransfers, RawTxn } from "../utils/arbiscan";
import { fetchCeloToUsdRate } from "../utils/priceUtils";

type WindowKey = "1y" | "6m" | "3m" | "1m";
const WINDOW_LABELS: Record<WindowKey, string> = {
  "1y": "Last Year",
  "6m": "Six Months",
  "3m": "Three Months",
  "1m": "This Month",
};

interface DashboardProps {
  address: string | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({ address }) => {
  const [history, setHistory] = useState<MonthBucket[]>([]);
  const [filterWindow, setFilterWindow] = useState<WindowKey>("1y");

  // Fetch & compute once
  useEffect(() => {
    if (!address) return;
    (async () => {
      let page = 1;
      const allTxns: RawTxn[] = [];
      while (true) {
        const txns = await fetchTokenTransfers(address, page++, 100);
        if (!txns.length) break;
        allTxns.push(...txns);
      }
      const buckets = await computeMonthlyUsdHistory(
        address,
        allTxns,
        fetchCeloToUsdRate
      );
      setHistory(buckets);
    })();
  }, [address]);

  // Build full-year balances
  const monthlyBalances = useMemo(
    () =>
      history.map((b) => ({
        month: b.month,
        balances: [b.deposits, b.loans, 0, 0, 0] as number[],
      })),
    [history]
  );

  // 3) Pick last N months ending on the current month
  const displayBalances = useMemo(() => {
    if (filterWindow === "1y") {
      return monthlyBalances;
    }

    const now = new Date();
    const currIdx = now.getMonth();
    const span = filterWindow === "6m" ? 6
              : filterWindow === "3m" ? 3
              : filterWindow === "1m" ? 1
              : 12;
    // compute start index, but never below 0
    const start = Math.max(0, currIdx - span + 1);
    const end = currIdx + 1; // slice is exclusive
    return monthlyBalances.slice(start, end);
  }, [monthlyBalances, filterWindow]);

  // Totals & maxima based on displayBalances
  const totals = useMemo(() => {
    const totals = [0, 0, 0, 0, 0];
    displayBalances.forEach((m) =>
      m.balances.forEach((v, i) => (totals[i] += v))
    );
    return totals.map((x) => `$${x.toLocaleString()}`);
  }, [displayBalances]);


  const maxTotalBalance = useMemo(
    () =>
      Math.max(
        ...displayBalances.map((m) => m.balances.reduce((sum, v) => sum + v, 0))
      ),
    [displayBalances]
  );

  return (
    <div className="dashboard">
      <div className="one">
        <div>
          <img src="/images/Vector3.png" alt="logo" />
          <p>Dao Dashboard Overview</p>
        </div>
        <ul>
          <li>
            <img src="/images/Chart Legend Dots1.png" alt="dot" /> Deposit
          </li>
          <li>
            <img src="/images/Chart Legend Dots2.png" alt="dot" /> Loans
          </li>
          <li>
            <img src="/images/Chart Legend Dots3.png" alt="dot" /> Shares
          </li>
          <li>
            <img src="/images/Chart Legend Dots4.png" alt="dot" /> Repayments
          </li>
          <li>
            <img src="/images/Chart Legend Dots5.png" alt="dot" /> Interest
          </li>

          {/* 5) time‐window select */}
          <select
            value={filterWindow}
            onChange={(e) => setFilterWindow(e.target.value as WindowKey)}
          >
            {Object.entries(WINDOW_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </ul>
      </div>

      <Balance
        deposit={totals[0]}
        loan={totals[1]}
        shares={totals[2]}
        repayments={totals[3]}
        interest={totals[4]}
      />

      <div className="bargraph">
        <div className="level">
          {[1, 0.75, 0.5, 0.25, 0].map((fraction, idx) => (
            <p key={idx}>
              {fraction === 0
                ? "0"
                : maxTotalBalance < 1000
                ? `${(maxTotalBalance * fraction).toFixed(0)}`
                : `${((maxTotalBalance * fraction) / 1000).toFixed(2)}k`}
            </p>
          ))}
        </div>

        <div className="allBars">
          {displayBalances.map((monthData, idx) => (
            <div key={idx} className="oneBar">
              {filterWindow === "1y" ? (
                // stacked style
                monthData.balances.map((bal, i) => (
                  <div
                    key={i}
                    title={`$${bal.toLocaleString()}`}
                    className={`bar-${i}`}
                    style={{
                      height: `${(bal / maxTotalBalance) * 100}%`,
                      backgroundColor: [
                        "#33C759",
                        "#30ADE6",
                        "#00C7BE",
                        "#FF9A00",
                        "#6F00D7",
                      ][i],
                    }}
                  />
                ))
              ) : (
                // grouped style: 5 side-by-side bars
                <div className="grouped">
                  {monthData.balances.map((bal, i) => (
                    <div
                      key={i}
                      title={`$${bal.toLocaleString()}`}
                      className="grouped-bar"
                      style={{
                        height: `${(bal / maxTotalBalance) * 100}%`,
                        backgroundColor: [
                          "#33C759",
                          "#30ADE6",
                          "#00C7BE",
                          "#FF9A00",
                          "#6F00D7",
                        ][i],
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="month-label">{monthData.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
