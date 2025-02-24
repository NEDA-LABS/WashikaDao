// useDaoNavigation.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dao, DaoRoleEnum } from "../../utils/Types";

// Define the roles that qualify for admin navigation.
// These roles should align with the backend's DaoRoleEnum values.
const ADMIN_ROLES = [
  DaoRoleEnum.CHAIRPERSON,
  DaoRoleEnum.TREASURER,
  DaoRoleEnum.SECRETARY,
];

/**
 * Custom hook for handling DAO navigation based on user roles.
 *
 * @param {Dao[]} daos - An array of DAO objects.
 * @returns An object containing:
 *  - filteredDaos: An array of DAOs that have a valid role property.
 *  - navigateToDao: A function to navigate to the appropriate page based on the DAO's role.
 *
 * @remarks
 * - Filters the list of DAOs to include only those with an assigned role.
 * - Uses the user's role to decide whether to navigate to a SuperAdmin dashboard or a standard DAO profile page.
 */
export const useDaoNavigation = (daos: Dao[]) => {
  const navigate = useNavigate();
  const [filteredDaos, setFilteredDaos] = useState<Dao[]>([]);

  // useEffect hook that filters the DAOs when the input array changes.
  useEffect(() => {
    if (!daos || daos.length === 0) {
      setFilteredDaos([]);
      return;
    }
    // Filter the DAOs to keep only those with a truthy 'role' value.
    setFilteredDaos(daos.filter((dao) => !!dao.role));
  }, [daos]);

  /**
   * Function to navigate to the correct DAO page based on the user's role.
   *
   * @param {Dao} dao - A single DAO object that includes role and transaction hash.
   *
   * @remarks
   * - If the DAO's role is in the ADMIN_ROLES array, the user is taken to the SuperAdmin dashboard.
   * - Otherwise, the user is redirected to the standard DAO profile page.
   */
  const navigateToDao = (dao: Dao) => {
    // Navigate to the admin dashboard for DAOs where the user holds an admin role.
    if (dao.role && ADMIN_ROLES.includes(dao.role)) {
      navigate(`/SuperAdmin/${dao.daoTxHash}`);
    } else {
      // Navigate to the regular DAO profile page.
      navigate(`/DaoProfile/${dao.daoTxHash}`);
    }
  };

  // Return the filtered list of DAOs and the navigation function.
  return { filteredDaos, navigateToDao };
};
