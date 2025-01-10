import React from "react";
import Balance from "./Balance";

const Dashboard: React.FC = () => {
  const monthlyBalances = [
    {
      month: "Jan",
      balances: [86000, 28000, 14000, 9000, 36000], // [Deposit, Loan, Shares, Repayments, Interest]
    },
    {
      month: "Feb",
      balances: [50000, 10000, 12000, 60000, 32000],
    },
    {
      month: "Mar",
      balances: [65000, 12000, 23000, 18500, 38000],
    },
    {
      month: "Apr",
      balances: [88000, 33000, 7000, 8000, 39000],
    },
    {
      month: "May",
      balances: [70000, 20000, 25000, 11500, 30000],
    },
    {
      month: "Jun",
      balances: [42000, 10000, 16000, 30000, 42000],
    },
    {
      month: "Jul",
      balances: [94000, 26000, 17000, 10500, 44000],
    },
    {
      month: "Aug",
      balances: [126000, 17000, 11000, 14000, 36000],
    },
    {
      month: "Sep",
      balances: [58000, 48000, 19000, 11500, 28000],
    },
    {
      month: "Oct",
      balances: [110000, 39000, 29000, 8000, 40000],
    },
    {
      month: "Nov",
      balances: [82000, 30000, 21000, 12500, 32000],
    },
    {
      month: "Dec",
      balances: [34000, 31000, 12000, 16000, 44000],
    },
  ];

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
          <img src="/images/Vector(2).png" alt="logo" />
          <p>Dao Dashboard Overview</p>
        </div>

        <ul>
          <li>
            <img src="/images/Chart Legend Dots [1.0].png" alt="dot" />
            Deposit{" "}
          </li>
          <li>
            <img src="/images/Chart Legend Dots [1.0](1).png" alt="dot" />
            Loans
          </li>
          <li>
            <img src="/images/Chart Legend Dots [1.0](2).png" alt="dot" />
            Shares
          </li>
          <li>
            <img src="/images/Chart Legend Dots [1.0](3).png" alt="dot" />
            Repayments
          </li>
          <li>
            <img src="/images/Chart Legend Dots [1.0](4).png" alt="dot" />
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
        deposit={formattedYearlyTotals[0]}
        loan={formattedYearlyTotals[1]}
        shares={formattedYearlyTotals[2]}
        repayments={formattedYearlyTotals[3]}
        interest={formattedYearlyTotals[4]}
      />
      <div className="bargraph">
        <div className="level">
          {/* Dynamically adjust the highest value to be the maximum total */}
          <p>{(maxTotalBalance / 1000).toFixed(0)}k</p>
          <p>{((maxTotalBalance * 0.75) / 1000).toFixed(0)}k</p>
          <p>{((maxTotalBalance * 0.5) / 1000).toFixed(0)}k</p>
          <p>{((maxTotalBalance * 0.25) / 1000).toFixed(0)}k</p>
          <p>0</p>
        </div>
        <div className="allBars">
          {monthlyBalances.map((monthData, index) => (
            <div key={index} className={`oneBar bar${index}`}>
              {monthData.balances.map((balance, i) => (
                <div
                  key={i}
                  className={`bar-${i + 1}`}
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
