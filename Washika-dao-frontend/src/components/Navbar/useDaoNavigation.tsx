// useDaoNavigation.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dao, DaoRoleEnum } from "../../utils/Types";

// This enum should match your backend DaoRoleEnum.

// Define which roles qualify for admin navigation.
const ADMIN_ROLES = [
  DaoRoleEnum.CHAIRPERSON,
  DaoRoleEnum.TREASURER,
  DaoRoleEnum.SECRETARY,
];

export const useDaoNavigation = (daos: Dao[]) => {
  const navigate = useNavigate();
  const [filteredDaos, setFilteredDaos] = useState<Dao[]>([]);

  useEffect(() => {
    if (!daos || daos.length === 0) {
      setFilteredDaos([]);
      return;
    }
    // Filter based on the role:
    setFilteredDaos(daos.filter(dao => !!dao.role));

  }, [daos]);

  const navigateToDao = (dao: Dao) => {
    // Navigate based on the member's role for this specific DAO.
    if (dao.role && ADMIN_ROLES.includes(dao.role)) {
      navigate(`/SuperAdmin/${dao.daoTxHash}`);
    } else {
      navigate(`/DaoProfile/${dao.daoTxHash}`);
    }
  };

  return { filteredDaos, navigateToDao };
}
