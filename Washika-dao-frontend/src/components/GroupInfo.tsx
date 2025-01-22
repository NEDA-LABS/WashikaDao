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
/**
 * A React functional component that displays a list of DAOs (Decentralized Autonomous Organizations)
 * with their details and member counts. It fetches DAO data from a backend service and updates the
 * component state accordingly. The component also adjusts its layout based on screen size.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the list of DAOs with their respective details.
 *
 * @remarks
 * - Utilizes `useEffect` to fetch DAO data and member counts asynchronously from specified endpoints.
 * - Handles screen resizing to adjust the display of DAO addresses.
 * - Displays DAO information including title, location, description, image, and member count.
 *
 * @interface Dao
 * @property {string} daoName - The name of the DAO.
 * @property {string} daoLocation - The location of the DAO.
 * @property {string} targetAudience - The target audience of the DAO.
 * @property {string} daoTitle - The title of the DAO.
 * @property {string} daoDescription - A brief description of the DAO.
 * @property {string} daoOverview - An overview of the DAO.
 * @property {string} daoImageIpfsHash - The IPFS hash for the DAO's image.
 * @property {string} daoMultiSigAddr - The multi-signature address used for fetching member count.
 * @property {number} kiwango - The financial value associated with the DAO.
 * @property {number} memberCount - The number of members in the DAO.
 *
 * @example
 * <GroupInfo />
 */
const GroupInfo: React.FC = () => {
  const [daos, setDaos] = useState<Dao[]>([]); // State to store DAOs with member count
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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
    const fetchMemberCount = async (multiSigAddr: string): Promise<number> => {
      try {
        const response = await fetch(
          `http://localhost:8080/JiungeNaDao/DaoDetails/${multiSigAddr}/members`
        );
        const data = await response.json();
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
            <Link to={`/DaoProfile/${group.daoMultiSigAddr}`}>
              <div className="image">
                <img src={group.daoImageIpfsHash} alt={group.daoTitle} />
                <div className="taarifaTop">Taarifa</div>
              </div>
              <div className="section-1">
                <div className="left">
                  <h2>{group.daoTitle}</h2>
                  <div className="location">
                    <p>{group.daoLocation}</p>
                    <img src="/images/location.png" />
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
                  <h3>Treasury Balance</h3>
                  <div>
                    <p className="currency">TSH</p>
                    <p className="amount">{group.kiwango.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <p className="section-2">{group.daoDescription}</p>
              <div className="section-3">
                <div className="top">
                  <img src="/images/profile.png" alt="idadi" />
                  <div className="taarifa">Member Details</div>
                </div>
                <div className="bottom">
                  <h2>Number of Members</h2>
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
