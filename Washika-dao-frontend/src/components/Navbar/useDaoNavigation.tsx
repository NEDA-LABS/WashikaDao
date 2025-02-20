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

export function useDaoNavigation(daos: Dao[], mode: NavigationMode) {
  const navigate = useNavigate();
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

  }, [daos, mode]);

  const navigateToDao = (dao: Dao) => {
    if (mode === "admin") {
      navigate(`/SuperAdmin/${dao.daoTxHash}`);
    } else {
      navigate(`/DaoProfile/${dao.daoTxHash}`);
    }
  };

  return { filteredDaos, navigateToDao };
};
