// import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import Strip from "../components/Strip";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  faPiggyBank,
  faHandHoldingUsd,
  faChartLine,
  faSyncAlt,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/**
 * @Auth Policy: Requires auth in order to be able to fetch data concerning the owner 
 * @returns 
 */
const Owner: React.FC = () => {
  // const navigate = useNavigate();
  const { firstName } = useSelector((state: RootState) => state.user);
  // const { daoMultiSig } = useSelector((state: RootState) => state.user);
  // const handleClick = () => {
  //   navigate(`/CreateProposal/${daoMultiSig}`);
  // };
  return (
    <>
      <NavBar className={"navbarOwner"} />
      <main className="owner">
        <div className="tops">
          <div className="one">
            <h1>Hi, {firstName}</h1>
            <p>Welcome to your one-stop platform for your DAO operations</p>
          </div>
          <img
            src="/images/Vector.png"
            alt="vector icon"
            width={48}
            height={114}
          />
        </div>

        <div className="button-group buttons">
          <button>Taarifa za Fedha</button>
          <button>Fanya Malipo</button>
          <button>Omba Mkopo</button>
          <button>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>This is your account information</h2>
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
            <div className="two">
              <div className="totals">
                <FontAwesomeIcon
                  className="icon"
                  icon={faPiggyBank}
                  color="#33C759"
                />
                <div className="groupss">
                  <p>TOTAL DEPOSIT</p>
                  <div className="amount">
                    <p>$96,000.00</p>
                    <div>+5%</div>
                  </div>
                </div>
              </div>
              <div className="totals">
                <FontAwesomeIcon
                  className="icon"
                  icon={faHandHoldingUsd}
                  color="#30ADE6"
                />
                <div className="groupss">
                  <p>TOTAL LOAN TAKEN</p>
                  <div className="amount">
                    <p>$24,000.00</p>
                    <div className="down">+3%</div>
                  </div>
                </div>
              </div>
              <div className="totals">
                <FontAwesomeIcon
                  className="icon"
                  icon={faChartLine}
                  color="#00C7BE"
                />
                <div className="groupss">
                  <p>TOTAL SHARES BOUGHT</p>
                  <div className="amount">
                    <p>$14,000.00</p>
                    <div>+7%</div>
                  </div>
                </div>
              </div>
              <div className="totals">
                <FontAwesomeIcon
                  className="icon"
                  icon={faSyncAlt}
                  color="#FF9A00"
                />
                <div className="groupss">
                  <p>TOTAL REPAYMENTS</p>
                  <div className="amount">
                    <p>$9,000.00</p>
                    <div className="down">+5%</div>
                  </div>
                </div>
              </div>
              <div className="totals">
                <FontAwesomeIcon
                  className="icon"
                  icon={faMoneyBillWave}
                  color="#6F00D7"
                />
                <div className="groupss">
                  <p>TOTAL INTEREST EARNED</p>
                  <div className="amount">
                    <p>$36,000.00</p>
                    <div className="down">+5%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bargraph">
              <div className="level">
                <p>20k</p>
                <p>15k</p>
                <p>10k</p>
                <p>0</p>
              </div>
              <div className="allBars">
                {Array.from({ length: 12 }, (_, index) => {
                  const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ];
                  return (
                    <div key={index} className={`oneBar bar${index}`}>
                      <div className="bar-1"></div>
                      <div className="bar-2"></div>
                      <div className="bar-3"></div>
                      <div className="bar-4">{months[index]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <section className="second">
          <div className="sec">
            <img src="/images/Vector(4).png" alt="logo" />
            <h1>My Proposals</h1>
          </div>
          <ProposalGroups />
        </section>
      </main>
      <Strip />
      <Footer className={"ownerFooter"} />
    </>
  );
};

export default Owner;
