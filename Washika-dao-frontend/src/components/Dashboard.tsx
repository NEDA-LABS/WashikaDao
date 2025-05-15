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

interface Bucket {
  label: string;
  balances: number[]; // [deposits, loans, shares, repayments, interest]
}

const Dashboard: React.FC<DashboardProps> = ({ address }) => {
  const [history, setHistory] = useState<MonthBucket[]>([]);
  const [allTxns, setAllTxns] = useState<RawTxn[]>([]);
  const [rate, setRate] = useState<number>(1);
  const [filterWindow, setFilterWindow] = useState<WindowKey>("1y");

  // 1️⃣ Fetch once: txns, rate, monthly buckets
  useEffect(() => {
    if (!address) return;
    (async () => {
      // fetch all txns
      let page = 1;
      const txs: RawTxn[] = [];
      while (true) {
        const batch = await fetchTokenTransfers(address, page++, 100);
        if (!batch.length) break;
        txs.push(...batch);
      }
      setAllTxns(txs);

      // fetch rate
      const usdRate = await fetchCeloToUsdRate();
      setRate(usdRate);

      // compute monthly USD history
      const mBuckets = await computeMonthlyUsdHistory(
        address,
        txs,
        async () => usdRate
      );
      setHistory(mBuckets);
    })();
  }, [address]);

  // 2️⃣ Monthly buckets Jan–Dec
  const monthlyBuckets = useMemo<Bucket[]>(
    () =>
      history.map((b) => ({
        label: b.month,
        balances: [b.deposits, b.loans, 0, 0, 0],
      })),
    [history]
  );

  // 3️⃣ Weekly buckets for current month
  const weeklyBuckets = useMemo<Bucket[]>(() => {
    if (filterWindow !== "1m" || !address) return [];
    const now = new Date();
    const ym = now.getFullYear();
    const mm = now.getMonth(); // 0–11

    // filter txns in current month
    const cur = allTxns.filter((tx) => {
      const d = new Date(tx.timestamp * 1000);
      return d.getFullYear() === ym && d.getMonth() === mm;
    });

    // group into weeks 0..4
    const weeks: Record<number, { deposits: number; loans: number }> = {};
    for (const tx of cur) {
      const d = new Date(tx.timestamp * 1000);
      const w = Math.floor((d.getDate() - 1) / 7); // week index
      if (!weeks[w]) weeks[w] = { deposits: 0, loans: 0 };
      const usd = tx.valueCelo * rate;
      if (tx.to.toLowerCase() === address.toLowerCase())
        weeks[w].deposits += usd;
      else weeks[w].loans += usd;
    }

    // map to array
    return Object.entries(weeks)
      .sort(([a], [b]) => +a - +b)
      .map(([w, vals]) => {
        // const start = +w * 7 + 1;
        // const lastDay = new Date(ym, mm + 1, 0).getDate();
        // const end = Math.min(start + 6, lastDay);
        return {
          label: `W${+w + 1}`,
          balances: [vals.deposits, vals.loans, 0, 0, 0],
        };
      });
  }, [filterWindow, allTxns, rate, address]);

  // 4️⃣ Choose display buckets
  const displayBuckets = useMemo<Bucket[]>(() => {
    if (filterWindow === "1y") return monthlyBuckets;
    if (filterWindow === "1m") return weeklyBuckets;
    // 6m or 3m
    const now = new Date();
    const idx = now.getMonth(); // 0–11
    const span = filterWindow === "6m" ? 6 : 3;
    const start = Math.max(0, idx - span + 1);
    return monthlyBuckets.slice(start, idx + 1);
  }, [filterWindow, monthlyBuckets, weeklyBuckets]);

  // 5️⃣ Totals for Balance
  const totals = useMemo(
    () =>
      displayBuckets
        .reduce<number[]>(
          (acc, b) => acc.map((sum, i) => sum + (b.balances[i] || 0)),
          [0, 0, 0, 0, 0]
        )
        .map((x) => `$${x.toLocaleString()}`),
    [displayBuckets]
  );

  // 6️⃣ maxTotalBalance scale
  const maxTotal = useMemo(
    () =>
      Math.max(
        0,
        ...displayBuckets.map((b) => b.balances.reduce((sum, v) => sum + v, 0))
      ),
    [displayBuckets]
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
            <img src="/images/Chart Legend Dots1.png" alt="" /> Deposit
          </li>
          <li>
            <img src="/images/Chart Legend Dots2.png" alt="" /> Loans
          </li>
          <li>
            <img src="/images/Chart Legend Dots3.png" alt="" /> Shares
          </li>
          <li>
            <img src="/images/Chart Legend Dots4.png" alt="" /> Repayments
          </li>
          <li>
            <img src="/images/Chart Legend Dots5.png" alt="" /> Interest
          </li>

          <select
            value={filterWindow}
            onChange={(e) => setFilterWindow(e.target.value as WindowKey)}
          >
            {Object.entries(WINDOW_LABELS).map(([k, lab]) => (
              <option key={k} value={k}>
                {lab}
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
          {[1, 0.75, 0.5, 0.25, 0].map((f, i) => {
            const val =
              f === 0
                ? "0"
                : maxTotal < 1000
                ? `${(maxTotal * f).toFixed(0)}`
                : `${((maxTotal * f) / 1000).toFixed(2)}k`;
            return <p key={i}>{val}</p>;
          })}
        </div>

        <div className="allBars">
          {displayBuckets.map((b, idx) => (
            <div key={idx} className="oneBar">
              {filterWindow === "1y" || filterWindow === "6m" ? (
                // stacked months
                b.balances.map((v, i) => (
                  <div
                    key={i}
                    title={`$${v.toLocaleString()}`}
                    className={`bar-${i}`}
                    style={{
                      height: `${maxTotal ? (v / maxTotal) * 100 : 0}%`,
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
                // grouped weeks or months
                <div className="grouped">
                  {b.balances.map((v, i) => (
                    <div
                      key={i}
                      title={`$${v.toLocaleString()}`}
                      className="grouped-bar"
                      style={{
                        height: `${maxTotal ? (v / maxTotal) * 100 : 0}%`,
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
              <div className="month-label">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
