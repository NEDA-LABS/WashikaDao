// useDaoNavigation.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dao, DaoRoleEnum } from "../../utils/Types";

// This enum should match your backend DaoRoleEnum.

export type NavigationMode = "admin" | "member";

// Define which roles qualify for admin navigation.
const ADMIN_ROLES = [
  DaoRoleEnum.CHAIRPERSON,
  DaoRoleEnum.TREASURER,
  DaoRoleEnum.SECRETARY,
];

// For member navigation, we may want only the "Member" role.
const MEMBER_ROLES = [DaoRoleEnum.MEMBER, DaoRoleEnum.FUNDER];

const useDaoNavigation = (daos: Dao[], mode: NavigationMode) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [filteredDaos, setFilteredDaos] = useState<Dao[]>([]);

  useEffect(() => {
    if (!daos || daos.length === 0) {
      setFilteredDaos([]);
      return;
    }
    // Filter based on the mode:
    const rolesToUse = mode === "admin" ? ADMIN_ROLES : MEMBER_ROLES;
    const matchingDaos = daos.filter((dao) =>
      dao.role ? rolesToUse.includes(dao.role) : false
    );
    setFilteredDaos(matchingDaos);

    if (matchingDaos.length === 1) {
      // Auto-navigate if exactly one DAO qualifies.
      navigate(
        mode === "admin"
          ? `/SuperAdmin/${matchingDaos[0].daoMultiSigAddr}`
          : `/DaoProfile/${matchingDaos[0].daoMultiSigAddr}`
      );
    } else if (matchingDaos.length > 1) {
      // Show the popup if more than one DAO qualifies.
      setShowPopup(true);
    }
  }, [daos, mode, navigate]);

  const navigateToDao = (dao: Dao) => {
    setShowPopup(false);
    if (mode === "admin") {
      navigate(`/SuperAdmin/${dao.daoMultiSigAddr}`);
    } else {
      navigate(`/DaoProfile/${dao.daoMultiSigAddr}`);
    }
  };

  return { showPopup, filteredDaos, navigateToDao };
};

export default useDaoNavigation;
