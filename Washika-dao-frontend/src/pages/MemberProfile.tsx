import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";

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
              <div>Dao Dashboard Overview</div>
              <ul>
                <li>Deposit </li>
                <li>Loans</li>
                <li>Shares</li>
                <li>Repayments</li>
                <li>Interest</li>
                <select name="" id="">
                  <option value="Last Year">Last Year</option>
                  <option value="Last Year">Last Year</option>
                  <option value="Last Year">Last Year</option>
                  <option value="Last Year">Last Year</option>
                </select>
              </ul>
            </div>
            <div className="two">
              <div>
                <div></div>
                <div>
                  <p>TOTAL DEPOSIT</p>
                  <div>
                    <p>$96,000</p>
                    <div>+5%</div>
                  </div>
                </div>
              </div>
              <div>
                <div></div>
                <div>
                  <p>TOTAL LOAN TAKEN</p>
                  <div>
                    <p>$24,000</p>
                    <div>+3%</div>
                  </div>
                </div>
              </div>
              <div>
                <div></div>
                <div>
                  <p>TOTAL OF SHARES BOUGHT</p>
                  <div>
                    <p>$14,000</p>
                    <div>+7%</div>
                  </div>
                </div>
              </div>
              <div>
                <div></div>
                <div>
                  <p>TOTAL REPAYMENTS</p>
                  <div>
                    <p>$9,000</p>
                    <div>+5%</div>
                  </div>
                </div>
              </div>
              <div>
                <div></div>
                <div>
                  <p>TOTAL INTEREST EARNED</p>
                  <div>
                    <p>$36,000</p>
                    <div>+5%</div>
                  </div>
                </div>
              </div>
            </div>
            <div>Bar</div>
          </div>
        </div>
        <button>Create a Proposal</button>
        <section className="second">
          <h1 className="main">Current Proposals</h1>
          <ProposalGroups />
        </section>
      </main>
      <Footer className={"footerDaoMember"} />
    </>
  );
};

export default MemberProfile;
