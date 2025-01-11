import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import DaoForm from "../components/DaoForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

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
    const [, setDaos] = useState<Dao[]>([]); // DAOs for selection
    const { firstName, lastName, email, phoneNumber, role, daoMultiSig, nationalIdNo } = useSelector((state: RootState) => state.user);

    useEffect(() => {
      const fetchDaos = async () => {
        try {
          const response = await fetch(
            "http://localhost:8080/FunguaDao/GetDaoDetails"
          );

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
      daoMultiSig,
      memberDaos: "",
      // guaranter,
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `http://localhost:8080/JiungeNaDao/DaoDetails/${daoMultiSig?.toLowerCase()}/AddMember`,
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
        <div className="popupp">
              <form onSubmit={handleSubmit}>
                <DaoForm
                  className="form"
                  title="Add Member"
                  description=""
                  fields={[
                    {
                      label: "First Name",
                      type: "text",
                      value: firstName,
                    },
                    {
                      label: "Last Name",
                      type: "text",
                      value: lastName,
                    },
                    {
                      label: "Email",
                      type: "email",
                      value: email,
                    },
                    {
                      label: "Phone Number",
                      type: "number",
                      value: phoneNumber,
                    },
                    {
                      label: "National ID",
                      type: "number",
                      value: "",
                    },
                    {
                      label: "Guaranter",
                      type: "select",
                      options: [
                        {
                          label: "Select Guaranter",
                          value: "",
                          disabled: true,
                          selected: true,
                        },
                        { label: "Chairperson", value: "Chairperson" },
                        { label: "Member", value: "Member" },
                        { label: "Funder", value: "Funder" },
                      ],
                      value: "",
                    },
                  ]}
                />
                <div className="center">
                  <button type="submit">Submit</button>
                  <button type="button">
                    Close
                  </button>
                </div>
              </form>
            </div>
      </main>
      <Footer className={"footerDaoMember"} />
    </>
  );
};

export default MemberProfile;