import Footer from "../components/Footer";
import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/ProposalGroups";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import DaoForm from "../components/DaoForm";
import { BASE_BACKEND_ENDPOINT_URL } from "../utils/backendUtils/backendComm";
import { Dao, fetchDaos } from "../hooks/useFetchDaos";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [daos, setDaos] = useState<Dao[]>([]); // DAOs for selection

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [nationalIdNo, setNationalIdNo] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [daoMultiSigAddr, setDaoMultiSigAddr] = useState<string>("");
  const [guarantor, setGuarantor] = useState<string>("");
  const [memberDaos, setMemberDaos] = useState<string[]>([]);

  const handleDaoChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const selectedDaoName = event.target.value;

    // Find the selected DAO in the list based on its name
    const chosenDao = daos.find((dao) => dao.daoName === selectedDaoName);

    if (chosenDao && !memberDaos.includes(chosenDao.daoName)) {
      setMemberDaos((prevDaos) => [...prevDaos, chosenDao.daoName]);
      setDaoMultiSigAddr(chosenDao.daoMultiSigAddr); // Save selected DAO’s address
    }
  };

  useEffect(() => {
    const getDaos = async () => {
      const daoList = await fetchDaos();
      setDaos(daoList);
    };
    getDaos();
  }, []);

  // Toggle the form popup visibility
  const handleAddMemberClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRole("Member")
    // Build payload data
    const payload = {
      memberAddr: localStorage.getItem("address"),
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberRole: role,
      daoMultiSigAddr,
      daos: memberDaos,
      guarantor,
      memberCustomIdentifier: crypto.randomUUID(),
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/MemberShip/RequestToJoinDao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          <button onClick={handleAddMemberClick}>Edit Settings</button>
        </div>

        <div className="dashboard-wrapper">
          <h2>This is your account information</h2>
          <Dashboard />
        </div>
        <button className="create" onClick={() => navigate("/CreateProposal")}>
          Create a Proposal
        </button>
        <section className="second">
          <div className="sec">
            <img src="/images/Vector(4).png" alt="logo" />
            <h1>Current Proposals</h1>
          </div>
          <ProposalGroups />
        </section>
        {showForm && (
          <div className=" popupp">
            <form onSubmit={handleSubmit}>
              <DaoForm
                className="form"
                title="Apply to be a Member"
                description=""
                fields={[
                  {
                    label: "First Name",
                    type: "text",
                    onChange: (e) => setFirstName(e.target.value),
                  },
                  {
                    label: "Last Name",
                    type: "text",
                    onChange: (e) => setLastName(e.target.value),
                  },
                  {
                    label: "email",
                    type: "email",
                    onChange: (e) => setEmail(e.target.value),
                  },
                  {
                    label: "Phone Number",
                    type: "tel",
                    onChange: (e) => setPhoneNumber(e.target.value),
                  },
                  {
                    label: "National Id",
                    type: "number",
                    onChange: (e) => setNationalIdNo(e.target.value),
                  },
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
                    onChange: handleDaoChange,
                  },
                  {
                    label: "Guarantor Number",
                    type: "number",
                    onChange: (e) => setGuarantor(e.target.value),
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
