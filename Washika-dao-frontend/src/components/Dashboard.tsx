import React from "react";
import Balance from "./Balance";

const Dashboard: React.FC = () => {
  const monthlyBalances = [
    {
      month: "Jan",
      balances: [0, 0, 0, 0, 0], // [Deposit, Loan, Shares, Repayments, Interest]
    },
    {
      month: "Feb",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Mar",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Apr",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "May",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Jun",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Jul",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Aug",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Sep",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Oct",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Nov",
      balances: [0, 0, 0, 0, 0],
    },
    {
      month: "Dec",
      balances: [0, 0, 0, 0, 0],
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
