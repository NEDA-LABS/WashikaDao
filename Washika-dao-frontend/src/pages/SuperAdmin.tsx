import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/ProposalGroups";
import WanachamaList, { DaoDetails } from "../components/WanachamaList";
import Dashboard from "../components/Dashboard";
import Cards from "../components/Cards";
import { useEffect, useState } from "react";
import DaoForm from "../components/DaoForm";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { toggleNotificationPopup } from "../redux/notifications/notificationSlice";
import { BASE_BACKEND_ENDPOINT_URL, ROUTE_PROTECTOR_KEY } from "../utils/backendComm";

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
  const [activeSection, setActiveSection] = useState<string>("daoOverview");
  const [showForm, setShowForm] = useState<boolean>(false); // State to toggle the popup form visibility
  // Form data state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number | string>("");
  const [nationalIdNo, setNationalIdNo] = useState<number | string>("");

  const [daoDetails, setDaoDetails] = useState<DaoDetails | undefined>(); //state to hold DAO details
  const [memberCount, setMemberCount] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const isVisible = useSelector(
    (state: RootState) => state.notification.isVisible
  );
  const dispatch = useDispatch();
  const token = localStorage.getItem("token") ?? "";
  const navigate = useNavigate();
  const { daoTxHash } = useParams<{ daoTxHash: string }>();
  const address = useSelector((state: RootState) => state.auth.address);
  const [authToken, setAuthToken] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedToken = localStorage.getItem("token") || "";
      if (storedToken) {
        setAuthToken(storedToken);
        clearInterval(intervalId);
      }
    }, 10); // check every 100ms
    return () => clearInterval(intervalId);
  }, []);


  const fetchDaoDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash?daoTxHash=${daoTxHash}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        setDaoDetails(data.daoDetails);
        setMemberCount(data.daoDetails.members.length);
      } else {
        console.error("Error fetching daoDetails:", data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (daoTxHash && authToken) {
      fetchDaoDetails();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoTxHash, authToken]);

  // Toggle the form popup visibility
  const handleAddMemberClick = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build payload data
    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberCustomIdentifier: crypto.randomUUID(),
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/MemberShip/AddMember/?daoTxHash=${daoTxHash}&adminMemberAddr=${address}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": ROUTE_PROTECTOR_KEY,
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(`Success: ${result.message}`);
        setShowForm(!showForm);
        // Re-fetch DAO details to update Memberount and WanachamaList
        fetchDaoDetails();
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
      <main className="member superAdmin">
        <>
          <div className="centered">
            <div className="daoImage one">
              <img src={daoDetails?.daoImageIpfsHash} alt="DaoImage" />
            </div>
          </div>

          {isVisible && (
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
                <button onClick={() => dispatch(toggleNotificationPopup())}>
                  <img src="/images/X.png" alt="cancel icon" />
                </button>
              </div>
            </div>
          )}
          <div className="top">
            <div className="one onesy">
              <h1>{daoDetails?.daoName}</h1>
              <div className="location">
                <p>{daoDetails?.daoLocation}</p>
                <img src="/images/locationIcon.png" width="27" height="31" />
              </div>
              <div>
                {daoDetails?.daoMultiSigAddr === daoDetails?.chairpersonAddr ? (
                  <button>Generate MultiSigAddress</button>
                ) : (
                  <p className="email">
                    {daoDetails?.daoMultiSigAddr
                      ? isSmallScreen
                        ? `${daoDetails?.daoMultiSigAddr.slice(
                            0,
                            14
                          )}...${daoDetails?.daoMultiSigAddr.slice(-9)}`
                        : daoDetails?.daoMultiSigAddr
                      : "N/A"}
                  </p>
                )}
              </div>
            </div>
            <div className="two">
              <div className="first">
                <div className="one">
                  <p className="left">TSH</p>
                  <p className="right">Treasury Balance</p>
                </div>
                <p className="amount">{daoDetails?.kiwango.toLocaleString()}</p>
              </div>
              <div className="section">
                <img src="/images/profile.png" alt="idadi" />
                <h2>
                  Number of
                  <br /> members
                </h2>
                <p>{memberCount}</p>
              </div>

              <button
                className="taarifa"
                onClick={() => setActiveSection("wanachama")}
              >
                Member Details
              </button>
            </div>
          </div>

          <div className="DaoOperations">
            <h1>DAO operations</h1>
          </div>
          <div className="button-group buttons">
            <button onClick={() => setActiveSection("daoOverview")} className={activeSection === "daoOverview" ? "active" : ""}>
              Dao Overview
            </button>
            <button onClick={handleAddMemberClick}>Add Members</button>
            <button onClick={() => setActiveSection("mikopo")}  className={activeSection === "mikopo" ? "active" : ""}>
              Loan Details
            </button>
            <button onClick={() => navigate(`/UpdateDao/${daoTxHash}`)}>
              Edit Settings
            </button>
          </div>

          {activeSection === "daoOverview" && (
            <>
              <div className="dashboard-wrapper">
                <div className="fullStatement">
                  <button>Full Statement</button>
                </div>
                <Dashboard />
              </div>
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
              <h2 className="heading">List of All members with loans</h2>
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
                <WanachamaList daoDetails={daoDetails} />
              </section>
            </>
          )}
        </>
      </main>
    </>
  );
};

export default SuperAdmin;
