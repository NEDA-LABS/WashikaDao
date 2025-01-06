import {
  faChartLine,
  faHandHoldingUsd,
  faMoneyBillWave,
  faPiggyBank,
  faSyncAlt,
} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/**
 * Renders the SuperAdmin component, which serves as the main dashboard interface
 * for super administrators. This component includes various sections such as
 * notifications, DAO operations, financial summaries, and current proposals.
 * 
 * The component utilizes FontAwesome icons for visual representation of financial
 * data and includes interactive elements like buttons for navigating through
 * different DAO functionalities.
 * 
 * @returns {JSX.Element} The rendered SuperAdmin component.
 */
const SuperAdmin: React.FC = () => {
  return (
    <>
      <NavBar className={"SuperAdmin"} />
      <main className="member superAdmin">
        <div className="centered">
          <div className="daoImage one">
          <img
            src="/images/WhatsApp Image 2023-09-24 at 03.24 1(2).png"
            alt="DaoImage"
          />
        </div>
        </div>
        
        <div className="notification">
          <div>
            <img src="/images/Info.png" alt="info icon" />
          </div>
          <div className="notifications">
            <h3>Notification</h3>
            <p>New Member Request</p>
            <button>View</button>
          </div>
          <div>
            <img src="/images/X.png" alt="cancel icon" />
          </div>
        </div>
        <div className="top">
          <div className="one onesy">
            <h1>Kikundi cha Jukumu</h1>
            <div className="location">
              <p>Dar-es-Salaam, Tanzania</p>
              <img src="/images/locationIcon.png" width="27" height="31" />
            </div>
            <p className="email">@JukumuDao.ETH</p>
          </div>
          <div className="two">
            <div className="first">
              <div className="one">
                <p className="left">TSH</p>
                <p className="right">Thamani ya hazina</p>
              </div>
              <p className="amount">3,000,000</p>
            </div>
            <div className="section">
              <img src="/images/profile.png" alt="idadi" />
              <h2>Idadi ya<br /> wanachama</h2>
              <p>23</p>
            </div>
            <div className="center">
              <div className="taarifa">Taarifa za wanachama</div>
            </div>
          </div>
        </div>

        <div className="DaoOperations">
          <h1>DAO operations</h1>
        </div>
        <div className="button-group buttons">
          <button>Dao Overview</button>
          <button>Add Members</button>
          <button>Taarifa za mikopo</button>
          <button>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <div className="fullStatement">
            <button>Full Statement</button>
          </div>
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
        <button className="create">Create a Proposal</button>
        <section className="second">
          <div className="sec">
            <img src="/images/Vector(4).png" alt="logo" />
            <h1>Current Proposals</h1>
          </div>
          <ProposalGroups />
        </section>
      </main>
    </>
  );
};

export default SuperAdmin;
