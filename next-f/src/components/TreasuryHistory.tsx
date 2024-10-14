interface TreasuryEntry {
  type: "Withdraw" | "Deposit";
  date: string;
  amount: string;
  value: string;
  icon: string;
}
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
      <h1>Treasury History</h1>
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
        <button>More History</button>
      </div>
    </div>
  );
};

export default TreasuryHistory;
