import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import WanachamaList from "../components/WanachamaList";
import Dashboard from "../components/Dashboard";
import Cards from "../components/Cards";
import { useEffect, useState } from "react";
import DaoForm from "../components/DaoForm";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useParams } from "react-router-dom";

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

interface DaoDetails {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  multiSigAddr: string;
  kiwango: number;
}

const SuperAdmin: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("daoOverview");
  const [showForm, setShowForm] = useState<boolean>(false); // State to toggle the popup form visibility
  const { memberAddr } = useSelector((state: RootState) => state.user);
  const daoMultiSig = memberAddr;
  // Form data state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number | string>("");
  const [nationalIdNo, setNationalIdNo] = useState<number | string>("");
  const [role, setRole] = useState<string>("");
  // const [guaranter, setGuaranter] = useState<string>("");
  const { daoMultiSigAddr } = useParams<{ daoMultiSigAddr: string }>();

  const [daoDetails, setDaoDetails] = useState<DaoDetails | null>(null); //state to hold DAO details
  const [memberCount, setMemberCount] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const fetchDaoDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/DaoProfile/DaoDetails/${daoMultiSigAddr}`
        );
        const data = await response.json();
        if (response.ok) {
          setDaoDetails(data.daoDetails);
        } else {
          console.error("Error fetching daoDetails:", data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchMemberCount = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/JiungeNaDao/DaoDetails/${daoMultiSigAddr}/members`
        );
        const data = await response.json();
        if (response.ok) {
          setMemberCount(data.memberCount);
        } else {
          console.error("Error fetching member count:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch member count:", error);
      }
    };

    if (daoMultiSigAddr) {
      fetchDaoDetails();
      fetchMemberCount();
    }

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1537); // Adjust for your breakpoints
    };

    // Initial check and event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [daoMultiSigAddr]);
  console.log(daoDetails);

  // Handle role change
  const handleRoleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setRole(e.target.value);
    // setGuaranter(e.target.value);
  };

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
      <NavBar className={"SuperAdmin"} />
      {daoDetails ? (
        <main className="member superAdmin">
          <div className="centered">
            <div className="daoImage one">
              <img
                src="/images/WhatsApp Image 2023-09-24 at 03.24 1(2).png"
                alt="DaoImage"
              />
            </div>
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
              <h1>{daoDetails?.daoName}</h1>
              <div className="location">
                <p>{daoDetails?.daoLocation}</p>
                <img src="/images/locationIcon.png" width="27" height="31" />
              </div>
              <p className="email">
                {daoMultiSigAddr
                  ? isSmallScreen
                    ? `${daoMultiSigAddr.slice(
                        0,
                        14
                      )}...${daoMultiSigAddr.slice(-9)}`
                    : `${daoMultiSigAddr}`
                  : "N/A"}
              </p>
            </div>
            <div className="two">
              <div className="first">
                <div className="one">
                  <p className="left">TSH</p>
                  <p className="right">Thamani ya hazina</p>
                </div>
                <p className="amount">{daoDetails?.kiwango.toLocaleString()}</p>
              </div>
              <div className="section">
                <img src="/images/profile.png" alt="idadi" />
                <h2>
                  Idadi ya
                  <br /> wanachama
                </h2>
                <p>{memberCount}</p>
              </div>

              <button
                className="taarifa"
                onClick={() => setActiveSection("wanachama")}
              >
                Taarifa za wanachama
              </button>
            </div>
          </div>

          <div className="DaoOperations">
            <h1>DAO operations</h1>
          </div>
          <div className="button-group buttons">
            <button onClick={() => setActiveSection("daoOverview")}>
              Dao Overview
            </button>
            <button onClick={handleAddMemberClick}>Add Members</button>
            <button onClick={() => setActiveSection("mikopo")}>
              Taarifa za mikopo
            </button>
            <button>Edit Settings</button>
          </div>

          {activeSection === "daoOverview" && (
            <>
              <div className="dashboard-wrapper">
                <div className="fullStatement">
                  <button>Full Statement</button>
                </div>
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
            </>
          )}

          {/* Render form popup when Add Member is clicked */}
          {showForm && (
            <div className="popup">
              <form onSubmit={handleSubmit}>
                <DaoForm
                  className="form"
                  title="Add Member"
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
                      label: "Email",
                      type: "email",
                      onChange: (e) => setEmail(e.target.value),
                    },
                    {
                      label: "Phone Number",
                      type: "number",
                      onChange: (e) => setPhoneNumber(e.target.value),
                    },
                    {
                      label: "National ID",
                      type: "number",
                      onChange: (e) => setNationalIdNo(e.target.value),
                    },
                    {
                      label: "Role",
                      type: "select",
                      options: [
                        {
                          label: "Select Role",
                          value: "",
                          disabled: true,
                          selected: true,
                        },
                        { label: "Chairperson", value: "Chairperson" },
                        { label: "Member", value: "Member" },
                        { label: "Funder", value: "Funder" },
                      ],
                      onChange: handleRoleChange,
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
                      onChange: handleRoleChange,
                    },
                  ]}
                />
                <div className="center">
                  <button type="submit">Submit</button>
                  <button type="button" onClick={handleAddMemberClick}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSection === "mikopo" && (
            <>
              <h2 className="heading">Wanachama wenye mikopo</h2>
              <section className="thirdy">
                <div className="left">
                  <div className="one">
                    <h2>Keywords</h2>
                    <ul>
                      <li>
                        Jina <img src="/images/X.png" alt="" />
                      </li>
                      <li>
                        Kiasi <img src="/images/X.png" alt="" />
                      </li>
                      <li>
                        Ada <img src="/images/X.png" alt="" />
                      </li>
                    </ul>
                  </div>
                  <div className="two">
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <div>
                        <label>Label</label>
                        <p>Description</p>
                      </div>
                    </div>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <div>
                        <label>Label</label>
                        <p>Description</p>
                      </div>
                    </div>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <div>
                        <label>Label</label>
                        <p>Description</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <label>Label</label>
                      <p>$0 - 10,000</p>
                    </div>
                    <input type="range" name="" id="" />
                  </div>
                  <div className="two">
                    <h2>Color</h2>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <label>Label</label>
                    </div>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <label>Label</label>
                    </div>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <label>Label</label>
                    </div>
                  </div>
                  <div>
                    <h2>Size</h2>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <label>Label</label>
                    </div>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <label>Label</label>
                    </div>
                    <div className="content">
                      <input type="checkbox" name="" id="" />
                      <label>Label</label>
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className="one">
                    <div className="search">
                      <input type="search" name="" id="" placeholder="Search" />
                      <img src="/images/Search.png" alt="" />
                    </div>

                    <div className="sort active">
                      <img src="/images/Check.png" alt="" />
                      Mikopo Mipya
                    </div>
                    <div className="sort">Mikopo inayo daiwa</div>
                    <div className="sort">Mikopo iliyo lipwa</div>
                    <div className="sort">Ada</div>
                  </div>
                  <Cards />
                </div>
              </section>
            </>
          )}

          {activeSection === "wanachama" && (
            <>
              <h2 className="heading">Taarifa za Wanachama</h2>
              <section className="fourth">
                <div className="search">
                  <input type="search" name="" id="" placeholder="Search" />
                  <img src="/images/Search.png" alt="" />
                </div>
                <WanachamaList />
              </section>
            </>
          )}
        </main>
      ) : (
        <main className="member superAdmin">
          <h2>No DAO Found</h2>
          <p>Please create or join a DAO to access this dashboard.</p>
          </main>
      )}
    </>
  );
};

export default SuperAdmin;
