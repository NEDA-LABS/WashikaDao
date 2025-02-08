import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import DaoForm from "../components/DaoForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { baseUrl } from "../utils/backendComm";

interface Dao {
  daoName: string;
  daoMultiSigAddr: string;
}
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
  // const [guaranter, setGuaranter] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false); // State to toggle the popup form visibility
  const [daos, setDaos] = useState<Dao[]>([]); // DAOs for selection
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    daoMultiSig,
    nationalIdNo,
  } = useSelector((state: RootState) => state.user);
  console.log(nationalIdNo);

  useEffect(() => {
    const fetchDaos = async () => {
      try {
        const response = await fetch(`http://${baseUrl}/DaoGenesis/GetAllDaos`);

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        // Parse JSON data safely
        const data = await response.json();
        console.log("Fetched DAOs:", data);

        // Check if daoList exists and is an array
        if (Array.isArray(data.daoList)) {
          setDaos(data.daoList);
        } else {
          console.error("daoList is missing or not an array");
        }
      } catch (error) {
        console.error("Failed to fetch DAOs:", error);
      }
    };
    fetchDaos();
  }, []);

  // Toggle the form popup visibility
  const handleAddMemberClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build payload data
    const payload = {
      memberAddr: "",
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberRole: role,
      daoMultiSigAddr: daoMultiSig,
      daos: "",
      // guaranter,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `http://${baseUrl}/DaoKit/MemberShip/RequestToJoinDao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setShowForm(!showForm);
        console.log(`Success: ${result.message}`);
      } else {
        console.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
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
            <div className="secondly">
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

        <div className="button-group buttons">
          <button>Account Information</button>
          <button>Make Payments</button>
          <button>Apply for Loan</button>
          <button>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>This is your account information</h2>
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
        <button onClick={handleAddMemberClick}>Join another Dao</button>
        {showForm && (
          <div className=" popupp">
            <form onSubmit={handleSubmit}>
              <DaoForm
                className="form"
                title="Apply to be a Member"
                description=""
                fields={[
                  {
                    label: "Select Dao",
                    type: "select",
                    options: [
                      {
                        label: "Select Dao",
                        value: "",
                        disabled: true,
                        selected: true,
                      },
                      ...daos.map((dao) => ({
                        label: "",
                        value: dao.daoName,
                      })),
                    ],
                    value: "",
                  },
                  {
                    label: "Guarantor Number",
                    type: "number",
                    value: "",
                  },
                ]}
              />
              <div className="center">
                <button className="createAccount" type="submit">
                  Submit
                </button>
                <button
                  className="closebtn"
                  type="button"
                  onClick={handleAddMemberClick}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
      <Footer className={"footerDaoMember"} />
    </>
  );
};

export default MemberProfile;
