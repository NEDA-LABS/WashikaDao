import { useEffect, useState } from "react";
import NavBar from "../components/Navbar/Navbar";
import ProposalGroups from "../components/ProposalGroups";
import TreasuryHistory from "../components/TreasuryHistory";
import { useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../utils/backendComm";

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
 * Component representing the public profile of a DAO (Decentralized Autonomous Organization).
 *
 * This component fetches and displays detailed information about a DAO, including its name,
 * location, description, and treasury details. It also provides options for DAO operations
 * such as creating proposals, purchasing shares, requesting loans, and making payments.
 *
 * The component uses the `useParams` hook to retrieve the DAO's multi-signature address
 * from the URL and fetches the DAO details and member count from the server. It also
 * adjusts its layout based on the screen size.
 *
 * @returns A React functional component that renders the DAO's public profile page.
 */
const DaoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { daoTxHash } = useParams<{ daoTxHash: string }>();

  const [daoDetails, setDaoDetails] = useState<DaoDetails | null>(null); //state to hold DAO details
  const [memberCount, setMemberCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const token = localStorage.getItem("token") ?? "";

  useEffect(() => {
    const fetchDaoDetails = async () => {
      try {
        const response = await fetch(
          `http://${baseUrl}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash?daoTxHash=${daoTxHash}`,{
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          setDaoDetails(data.daoDetails);
          setMemberCount(data.daoDetails.members.length);
        } else {
          console.error("Error fetching daoDetails:", data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (daoTxHash) {
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
  }, [daoDetails?.daoMultiSigAddr, daoTxHash, token]);
  console.log(daoDetails);

  const handleClick = () => {
    navigate(`/CreateProposal/${daoTxHash}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!daoDetails) {
    return <div>DAO Details not available</div>;
  }
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

export default DaoProfile;
