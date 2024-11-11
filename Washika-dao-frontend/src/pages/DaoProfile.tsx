import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import ProposalGroups from "../components/ProposalGroups";
import TreasuryHistory from "../components/TreasuryHistory";
import { useNavigate, useParams } from "react-router-dom";

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

const DaoProfile: React.FC = () => {
  const navigate = useNavigate();
  const { daoMultiSigAddr } = useParams<{ daoMultiSigAddr: string }>();

  const [daoDetails, setDaoDetails] = useState<DaoDetails | null>(null); //state to hold DAO details
  const [memberCount, setMemberCount] = useState<number>(0);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDaoDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/DaoProfile/DaoDetails/${daoMultiSigAddr}`
        );
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
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
  }, [daoMultiSigAddr]);

  const handleClick = () => {
    navigate(`/CreateProposal/${daoMultiSigAddr}`);
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
                {daoDetails.multiSigAddr}
              </p>
            </div>

            <p className="section-2">
              {daoDetails.daoDescription}
            </p>

            <div className="DaoOperations">
              <h1>DAO operations</h1>
              <div className="button-group">
                <button className="button-1" onClick={handleClick}>
                  Create a Proposal
                </button>
                <button className="button-2">Vote on a proposal</button>
              </div>
            </div>

            <div className="details">
              <p className="email">
                {daoDetails.multiSigAddr}
              </p>
              <p className="parag">
                This is the multi-sig account for{" "}
                {daoDetails.daoName}. Create a proposal to get
                access to the JUKUMU fund.
              </p>
            </div>
          </div>

          <div className="treasury">
            <div className="first">
              <div className="one">
                <p className="left">TSH</p>
                <p className="right">Thamani ya hazina</p>
              </div>
              <p className="amount">{daoDetails.kiwango}</p>
            </div>

            <div className="section-3">
              <div className="top">
                <img src="images/profile.png" alt="idadi" />
                <div className="taarifa">Taarifa za wanachama</div>
              </div>
              <div className="bottom">
                <h2>Idadi ya wanachama</h2>
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
