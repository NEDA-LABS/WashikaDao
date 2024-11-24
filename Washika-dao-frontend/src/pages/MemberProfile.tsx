import {
  faChartLine,
  faHandHoldingUsd,
  faMoneyBillWave,
  faPiggyBank,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MemberProfile: React.FC = () => {
  return (
    <>
      <NavBar className={"navbarDaoMember"} />
      <main className="member">
        <section className="one">
          <div className="first">
            <h1>Karibu mshikaDAU</h1>
            <p>
              Tuna kurahisishia kujua na kupata taarifa zako
              <br />
              zote muhimu za vikundi vyako vya kifedha{" "}
            </p>
          </div>
          <div className="center">
            <div className="second">
              <div className="header">
                <div className="left">
                  <img src="/images/speed-up-line.png" alt="logo" />
                  <h1>Credit Score</h1>
                </div>
                <div className="right">
                  <img src="/images/Vector(1).png" alt="" />
                  <p>Apply</p>
                </div>
              </div>
              <div className="credit">
                <h2>
                  Your <span>credit score </span>is <span>0</span>
                </h2>
                <p>Build your credit score by buying shares</p>
              </div>
              <div className="bars">
                {Array.from({ length: 36 }, (_, index) => (
                  <div key={index}></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="button-group">
          <button>Taarifa za Fedha</button>
          <button>Fanya Malipo</button>
          <button>Omba Mkopo</button>
          <button>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>Taarifa za fedha</h2>
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
        <button className="create">Create a Proposal</button>
        <section className="second">
          <div className="sec">
            <img src="/images/Vector(4).png" alt="logo" />
            <h1>Current Proposals</h1>
          </div>
          <ProposalGroups />
        </section>
      </main>
      <Footer className={"footerDaoMember"} />
    </>
  );
};

export default MemberProfile;
