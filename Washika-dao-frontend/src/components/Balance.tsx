import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPiggyBank,
  faHandHoldingUsd,
  faChartLine,
  faSyncAlt,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

interface BalanceProps {
  icon: IconDefinition;
  color: string;
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
}

interface YearlyBalanceProps {
  deposit: string;
  loan: string;
  shares: string;
  repayments: string;
  interest: string;
}

const Balance: React.FC<YearlyBalanceProps> = ({
  deposit,
  loan,
  shares,
  repayments,
  interest,
}) => {
  const BalanceData: BalanceProps[] = [
    {
      icon: faPiggyBank,
      color: "#33C759",
      title: "TOTAL DEPOSIT",
      amount: deposit,
      change: "0%",
      isPositive: true,
    },
    {
      icon: faHandHoldingUsd,
      color: "#30ADE6",
      title: "TOTAL LOAN TAKEN",
      amount: loan,
      change: "0%",
      isPositive: false,
    },
    {
      icon: faChartLine,
      color: "#00C7BE",
      title: "TOTAL SHARES BOUGHT",
      amount: shares,
      change: "0%",
      isPositive: true,
    },
    {
      icon: faSyncAlt,
      color: "#FF9A00",
      title: "TOTAL REPAYMENTS",
      amount: repayments,
      change: "0%",
      isPositive: false,
    },
    {
      icon: faMoneyBillWave,
      color: "#6F00D7",
      title: "TOTAL INTEREST EARNED",
      amount: interest,
      change: "0%",
      isPositive: false,
    },
  ];

  return (
    <div className="two">
      {BalanceData.map((Balance, index) => (
        <div key={index} className="totals">
          <FontAwesomeIcon className="icon" icon={Balance.icon} color={Balance.color} />
          <div className="groupss">
            <p>{Balance.title}</p>
            <div className="amount">
              <p>{Balance.amount}</p>
              <div className={Balance.isPositive ? "" : "down"}>{Balance.change}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Balance;
