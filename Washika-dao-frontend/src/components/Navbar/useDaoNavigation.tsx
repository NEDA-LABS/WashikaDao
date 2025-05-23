import { useNavigate } from "react-router-dom";
import { OnchainDao } from "../../utils/Types";
import { useActiveAccount } from "thirdweb/react";

/**
 * Custom hook for handling DAO navigation based on user roles.
 *
 * @param {OnChainDao[]} daos - An array of DAO objects.
 * @returns An object containing:
 *  - filteredDaos: An array of DAOs that have a valid role property.
 *  - navigateToDao: A function to navigate to the appropriate page based on the DAO's role.
 */
export const useDaoNavigation = (daos: OnchainDao[]) => {
  const navigate = useNavigate();
  const activeAccount = useActiveAccount();
  const memberAddr = activeAccount?.address;

  const filteredDaos = daos.filter((dao) => dao.daoCreator);
  

  const navigateToDao = (dao: OnchainDao) => {
    // Navigate to the admin dashboard for DAOs where the user holds an admin role.
    if (memberAddr && dao.daoCreator.toLowerCase() === memberAddr.toLowerCase()) {
      navigate(`/SuperAdmin/${dao.daoCreator}`);
    } else {
      // Navigate to the regular DAO profile page.
      navigate(`/DaoProfile/${dao.daoCreator}`);
    }
  };

  // Return the filtered list of DAOs and the navigation function.
  return { filteredDaos, navigateToDao };
};
