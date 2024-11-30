import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Define the DAO interface including memberCount
interface Dao {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoMultiSigAddr: string; // Use multiSigAddr for fetching member count
  kiwango: number;
  memberCount: number; // Add memberCount field
}

const GroupInfo: React.FC = () => {
  const [daos, setDaos] = useState<Dao[]>([]); // State to store DAOs with member count
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [daoMultiSigAddr, setDaoMultiSigAddr] = useState("");

  useEffect(() => {
    const fetchDaos = async () => {
      try {
        // Fetch the DAOs from the backend
        const response = await fetch(
          "http://localhost:8080/FunguaDao/GetDaoDetails"
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        // Parse JSON data safely
        const data = await response.json();
        console.log("Fetched DAOs:", data);

        if (Array.isArray(data.daoList)) {
          // For each DAO, fetch the member count using multiSigAddr
          const daoWithMemberCounts = await Promise.all(
            data.daoList.map(async (dao: Dao) => {
              const memberCount = await fetchMemberCount(dao.daoMultiSigAddr); // Use multiSigAddr to fetch member count
              return { ...dao, memberCount }; // Add memberCount to the DAO object
            })
          );

          setDaos(daoWithMemberCounts); // Update state with DAOs and their member counts
        } else {
          console.error("daoList is missing or not an array");
        }
      } catch (error) {
        console.error("Failed to fetch DAOs:", error);
      }
    };

    // Fetch the member count for a given multiSigAddr
    const fetchMemberCount = async (MultiSigAddr: string): Promise<number> => {
      try {
        const response = await fetch(
          `http://localhost:8080/JiungeNaDao/DaoDetails/${MultiSigAddr}/members`
        );
        const data = await response.json();
        setDaoMultiSigAddr(MultiSigAddr);
        return response.ok ? data.memberCount : 0; // Return member count or 0 if no data
      } catch (error) {
        console.error("Failed to fetch member count:", error);
        return 0; // Return 0 in case of an error
      }
    };

    fetchDaos(); // Call the function to fetch DAOs and their member counts

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1537); // Adjust for your breakpoints
    };

    // Initial check and event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="groups">
      {daos.map(
        (
          group,
          index // Iterate over the group data array
        ) => (
          <div className="group" key={index}>
            {" "}
            {/* Each group's container */}
            <Link to={`/PublicDaoProfile/${daoMultiSigAddr}`}>
              <div className="image">
                <img src={group.daoImageIpfsHash} alt={group.daoTitle} />
                <div className="taarifaTop">Taarifa</div>
              </div>
              <div className="section-1">
                <div className="left">
                  <h2>{group.daoTitle}</h2>
                  <div className="location">
                    <p>{group.daoLocation}</p>
                    <img src="images/location.png" />
                  </div>
                  <p className="email">
                    {group.daoMultiSigAddr
                      ? isSmallScreen
                        ? `${group.daoMultiSigAddr.slice(
                            0,
                            14
                          )}...${group.daoMultiSigAddr.slice(-9)}`
                        : `${group.daoMultiSigAddr}`
                      : "N/A"}
                  </p>
                </div>
                <div className="right">
                  <h3>Thamani ya hazina</h3>
                  <div>
                    <p className="currency">TSH</p>
                    <p className="amount">{group.kiwango.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <p className="section-2">{group.daoDescription}</p>
              <div className="section-3">
                <div className="top">
                  <img src="images/profile.png" alt="idadi" />
                  <div className="taarifa">Taarifa za wanachama</div>
                </div>
                <div className="bottom">
                  <h2>Idadi ya wanachama</h2>
                  <p>{group.memberCount}</p>
                </div>
              </div>
            </Link>
          </div>
        )
      )}
    </div>
  );
};

export default GroupInfo;
