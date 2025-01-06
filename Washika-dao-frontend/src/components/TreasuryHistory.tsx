interface TreasuryEntry {
  type: "Withdraw" | "Deposit";
  date: string;
  amount: string;
  value: string;
  icon: string;
}
/**
 * A React functional component that displays a mini statement of treasury transactions.
 * 
 * This component renders a list of treasury entries, each representing a financial transaction
 * such as a deposit or withdrawal. Each entry includes details like the transaction type, date,
 * amount, value, and an associated icon. The component also provides a button to view the full statement.
 * 
 * @interface TreasuryEntry
 * @property {("Withdraw" | "Deposit")} type - The type of the transaction.
 * @property {string} date - The date of the transaction.
 * @property {string} amount - The amount involved in the transaction, including currency.
 * @property {string} value - The value of the transaction in USD.
 * @property {string} icon - The URL of the icon representing the transaction type.
 * 
 * @returns {JSX.Element} A JSX element representing the mini statement UI.
 */
const TreasuryHistory: React.FC = () => {
  const treasuryData: TreasuryEntry[] = [
    {
      type: "Withdraw",
      date: "10/07/2023",
      amount: "-409.95USDC",
      value: "$409.95",
      icon: "/images/withdrawIcon.png",
    },
    {
      type: "Deposit",
      date: "10/07/2023",
      amount: "409.95USDC",
      value: "$409.95",
      icon: "/images/deposit.png",
    },
    {
      type: "Deposit",
      date: "10/07/2023",
      amount: "409.95USDC",
      value: "$409.95",
      icon: "/images/deposit.png",
    },
    {
      type: "Deposit",
      date: "10/07/2023",
      amount: "409.95USDC",
      value: "$409.95",
      icon: "/images/deposit.png",
    },
    {
      type: "Withdraw",
      date: "10/07/2023",
      amount: "-409.95USDC",
      value: "$409.95",
      icon: "/images/withdrawIcon.png",
    },
    {
      type: "Deposit",
      date: "10/07/2023",
      amount: "409.95USDC",
      value: "$409.95",
      icon: "/images/deposit.png",
    },
    {
      type: "Deposit",
      date: "10/07/2023",
      amount: "409.95USDC",
      value: "$409.95",
      icon: "/images/deposit.png",
    },
    {
      type: "Withdraw",
      date: "10/07/2023",
      amount: "-409.95USDC",
      value: "$409.95",
      icon: "/images/withdrawIcon.png",
    },
  ];

  return (
    <div className="treasury-history">
      <h1>Mini Statement</h1>
      <div id="treasury-history">
        {treasuryData.map((entry, index) => (
          <div className="slot" key={index}>
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
              <div>
                <p className="top">{entry.amount}</p>
                <p className="bottom">{entry.value}</p>
              </div>
              <img src="/images/expand.png" alt="expand icon" />
            </div>
          </div>
        ))}
      </div>
      <div className="history-button">
        <button>Full Statement</button>
      </div>
    </div>
  );
};

export default TreasuryHistory;
