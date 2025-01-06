import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import Dashboard from "../components/Dashboard";
/**
 * @Auth policy: Should definitely be authenticated to make sense
 * @returns 
 */
/**
 * Renders the MemberProfile component, which provides an overview of a DAO member's financial
 * information and activities. This component includes sections for credit score, financial
 * transactions, and current proposals. It utilizes various FontAwesome icons for visual
 * representation and includes navigation and footer components.
 *
 * @returns {JSX.Element} The JSX code for rendering the MemberProfile component.
 * @remarks This component is intended for authenticated users to view and manage their financial
 * data within the DAO platform.
 */
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
            <div className="secondy">
              <div className="header">
                <div className="left">
                  <img src="/images/speed-up-line.png"alt="logo" />
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

        <div className="button-group buttons">
          <button>Taarifa za Fedha</button>
          <button>Fanya Malipo</button>
          <button>Omba Mkopo</button>
          <button>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>Taarifa za fedha</h2>
          <Dashboard />
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
