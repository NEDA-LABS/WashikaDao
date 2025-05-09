import React, { useEffect, useState } from "react";
import Balance from "./Balance";
import {
  computeMonthlyUsdHistory,
  MonthBucket,
} from "../utils/monthlyBalances";
import { fetchTokenTransfers, RawTxn } from "../utils/arbiscan";
import { fetchCeloToUsdRate } from "../utils/priceUtils";

interface DashboardProps {
  address: string | undefined;
}

const Dashboard: React.FC<DashboardProps> = ({ address }) => {
  const [history, setHistory] = useState<MonthBucket[]>([]);

  useEffect(() => {
    if (!address) return;

    (async () => {
      let page = 1;
      let allTxns: RawTxn[] = [];
      while (true) {
        const txns = await fetchTokenTransfers(address, page, 100);
        if (txns.length === 0) break;
        allTxns = [...allTxns, ...txns];
        page++;
      }
      
      // 2) compute the monthly net USD inflow/outflow
      const buckets = await computeMonthlyUsdHistory(
        address,
        allTxns,
        fetchCeloToUsdRate
      );
      setHistory(buckets);
    })();
  }, [address]);

  const monthlyBalances = history.map((b) => ({
    month: b.month,
    balances: [b.deposits, b.loans, 0, 0, 0] as number[],
  }));

  // Calculate yearly totals for each balance type
  const yearlyTotals = monthlyBalances.reduce(
    (totals, monthData) => {
      monthData.balances.forEach((balance, index) => {
        totals[index] += balance;
      });
      return totals;
    },
    [0, 0, 0, 0, 0] // Initialize totals for [Deposit, Loan, Shares, Repayments, Interest]
  );

  // Format yearly totals
  const formattedYearlyTotals = yearlyTotals.map(
    (total) => `$${total.toLocaleString()}`
  );

  // Calculate the maximum total balance for any month
  const maxTotalBalance = Math.max(
    ...monthlyBalances.map((month) =>
      month.balances.reduce((sum, value) => sum + value, 0)
    )
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
            <img src="/images/Chart Legend Dots1.png" alt="dot" />
            Deposit{" "}
          </li>
          <li>
            <img src="/images/Chart Legend Dots2.png" alt="dot" />
            Loans
          </li>
          <li>
            <img src="/images/Chart Legend Dots3.png" alt="dot" />
            Shares
          </li>
          <li>
            <img src="/images/Chart Legend Dots4.png" alt="dot" />
            Repayments
          </li>
          <li>
            <img src="/images/Chart Legend Dots5.png" alt="dot" />
            Interest
          </li>
          <select name="" id="">
            <option value="Last Year">Last Year</option>
            <option value="Last Year">Last Year</option>
            <option value="Last Year">Last Year</option>
            <option value="Last Year">Last Year</option>
          </select>
        </ul>
      </div>
      <Balance
        deposit={formattedYearlyTotals[0].toLocaleString()}
        loan={formattedYearlyTotals[1]}
        shares={formattedYearlyTotals[2]}
        repayments={formattedYearlyTotals[3]}
        interest={formattedYearlyTotals[4]}
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
          {monthlyBalances.map((monthData, index) => (
            <div key={index} className={`oneBar bar${index}`}>
              {monthData.balances.map((balance, i) => (
                <div
                  key={i}
                  className={`bar-${i - 1}`}
                  style={{
                    height: `${(balance / maxTotalBalance) * 100}%`,
                    backgroundColor: [
                      "#33C759", // Deposit
                      "#30ADE6", // Loan
                      "#00C7BE", // Shares
                      "#FF9A00", // Repayments
                      "#6F00D7", // Interest
                    ][i],
                  }}
                ></div>
              ))}
              <div className="month-label">{monthData.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
