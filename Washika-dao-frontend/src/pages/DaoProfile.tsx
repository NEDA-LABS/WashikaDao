import { useEffect, useState } from "react";
import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/ProposalGroups";
import TreasuryHistory from "../components/TreasuryHistory";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../utils/backendComm";

/**
 * Interface representing the details of a DAO (Decentralized Autonomous Organization).
 *
 * @property {string} daoName - The name of the DAO.
 * @property {string} daoLocation - The geographic location or operating region of the DAO.
 * @property {string} targetAudience - The intended audience for the DAO.
 * @property {string} daoTitle - A title or tagline for the DAO.
 * @property {string} daoDescription - A short description of the DAO.
 * @property {string} daoOverview - A more detailed overview of the DAO.
 * @property {string} daoImageIpfsHash - The IPFS hash for the DAO's image.
 * @property {string} daoMultiSigAddr - The multi-signature address associated with the DAO.
 * @property {number} kiwango - The treasury balance or another numeric metric related to the DAO.
 */
interface DaoDetails {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoMultiSigAddr: string;
  kiwango: number;
}

/**
 * DaoProfile component renders the public profile page for a DAO.
 *
 * This component:
 * - Uses the URL parameter (daoTxHash) to identify the DAO.
 * - Fetches DAO details and member count from the backend.
 * - Adjusts its layout based on screen size.
 * - Displays DAO information including image, location, description, treasury balance,
 *   and current proposals, along with various DAO operations.
 *
 * @returns {JSX.Element} The rendered DAO public profile page.
 */
const DaoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { daoTxHash } = useParams<{ daoTxHash: string }>();

  const [daoDetails, setDaoDetails] = useState<DaoDetails | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const token = localStorage.getItem("token") ?? "";
  const [authToken, setAuthToken] = useState<string>("");

  // Effect to continuously check for an authentication token in localStorage.
  useEffect(() => {
    // Set up a short-interval polling to retrieve the token.
    const intervalId = setInterval(() => {
      const storedToken = localStorage.getItem("token") || "";
      if (storedToken) {
        setAuthToken(storedToken);
        clearInterval(intervalId); // Clear the interval once the token is found.
      }
    }, 10); // check every 100ms
    return () => clearInterval(intervalId);
  }, []);

  /**
   * Asynchronously fetch DAO details from the backend using the provided daoTxHash.
   *
   * Makes a GET request to the backend API with the daoTxHash and the authentication token.
   * If successful, updates the daoDetails and memberCount states; otherwise logs errors.
   */
  const fetchDaoDetails = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash?daoTxHash=${daoTxHash}`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Update the component state with fetched DAO details.
        setLoading(false);
        setDaoDetails(data.daoDetails);
        // Update the member count based on the length of the members array.
        setMemberCount(data.daoDetails.members.length);
      } else {
        console.error("Error fetching daoDetails:", data.message);
      }
    } catch (error) {
      alert("Error fetching Dao");
      console.error(error);
    }
  };

  // Effect hook to fetch DAO details and set up a resize listener.
  useEffect(() => {
    // If both daoTxHash and authToken are available, fetch the DAO details.
    if (daoTxHash && authToken) {
      fetchDaoDetails();
    }

    // Define a function to update the isSmallScreen state based on window width.
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1537); // Adjust for your breakpoints
    };

    // Perform an initial check for screen size.
    handleResize();
    // Add an event listener to update screen size on window resize.
    window.addEventListener("resize", handleResize);

    // Cleanup: remove the resize event listener when the component unmounts.
    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daoDetails?.daoMultiSigAddr, daoTxHash, authToken]);

  /**
   * Handles navigation to the Create Proposal page for the current DAO.
   */
  const handleClick = () => {
    navigate(`/CreateProposal/${daoTxHash}`);
  };

  // If the data is still loading, display a loading indicator.
  if (loading) {
    return <div>Loading...</div>;
  }
  // If no DAO details were fetched, display an error message.
  if (!daoDetails) {
    return <div>DAO Details not available</div>;
  }

  // Render the DAO profile page with navigation, DAO information, and operational controls.
  return (
    <>
      <NavBar className={"DaoProfile"} />
      <main className="daoMain">
        <div className="daoImage">
          <img
            src={daoDetails.daoImageIpfsHash}
            alt="DaoImage"
            width={1450}
            height={509}
          />
        </div>
        <section className="first">
          <div className="left">
            <div className="one">
              <h1>{daoDetails.daoName}</h1>
              <div className="location">
                <p>{daoDetails.daoLocation}</p>
                <img src="/images/locationIcon.png" width="27" height="31" />
              </div>
              <p className="email">
                {daoDetails.daoMultiSigAddr
                  ? isSmallScreen
                    ? `${daoDetails.daoMultiSigAddr.slice(
                        0,
                        14
                      )}...${daoDetails.daoMultiSigAddr.slice(-9)}`
                    : `${daoDetails.daoMultiSigAddr}`
                  : "N/A"}
              </p>
            </div>

            <p className="section-21">{daoDetails.daoDescription}</p>
            <p className="section-22">{daoDetails.daoOverview}</p>

            <div className="DaoOperations">
              <h1>DAO operations</h1>
              <div className="button-group">
                <button className="button-1" onClick={handleClick}>
                  Dao Overview
                </button>
                <button className="button-2">Buy Shares</button>
                <button className="button-2" onClick={handleClick}>
                  Apply for Loan
                </button>
                <button className="button-2">Make Payments</button>
              </div>
            </div>
          </div>

          <div className="treasury">
            <div className="first">
              <div className="one">
                <p className="left">TSH</p>
                <p className="right">Treasury Balance</p>
              </div>
              <p className="amount">{daoDetails.kiwango.toLocaleString()}</p>
            </div>

            <div className="section-3">
              <div className="top">
                <img src="/images/profile.png" alt="idadi" />
                <div className="taarifa">Member Details</div>
              </div>
              <div className="bottom">
                <h2>Number of members</h2>
                <p>{memberCount}</p>
              </div>
              <div className="fundDao">
                <button>FUND DAO</button>
              </div>
            </div>

            <TreasuryHistory />
          </div>
        </section>

        <section className="second">
          <h1 className="main">Current Proposals</h1>
          <ProposalGroups />
        </section>
      </main>
    </>
  );
};

// Export the DaoProfile component for use in the application routing.
export default DaoProfile;
