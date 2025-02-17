// DaoSelectionPopup.tsx
import React from "react";
import { Dao } from "../../utils/Types";

interface DaoSelectionPopupProps {
  daos: Dao[];
  onSelect: (dao: Dao) => void;
  onClose: () => void;
}

const DaoSelectionPopup: React.FC<DaoSelectionPopupProps> = ({ daos, onSelect, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Select a DAO</h3>
        <ul>
          {daos.map((dao) => (
            <li key={dao.daoTxHash}>
              <button onClick={() => onSelect(dao)}>
                {dao.daoName} ({dao.daoTxHash})
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DaoSelectionPopup;
