// DaoSelectionPopup.tsx
import React from "react";
import { Dao } from "../../utils/Types";

interface DaoSelectionPopupProps {
  daos: Dao[];
  onSelect: (dao: Dao) => void;
}

const DaoSelectionPopup: React.FC<DaoSelectionPopupProps> = ({
  daos,
  onSelect,
}) => {
  const handleSelect = (dao: Dao) => {
    localStorage.setItem("selectedDaoTxHash", dao.daoTxHash);
    onSelect(dao);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content2">
        <ul>
          {daos.map((dao) => (
            <li key={dao.daoTxHash} onClick={() => handleSelect(dao)}>
              {dao.daoName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DaoSelectionPopup;
