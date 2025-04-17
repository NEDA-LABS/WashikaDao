import React from "react";

export interface LoadingPopupProps {
  onCancel: () => void;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ onCancel }) => (
  <div className="loading-popup">
    <div className="loading-content">
      <p>Creating DAO on-chain...</p>
      <div className="spinner-and-cancel">
        <div className="spinner" />
        <button onClick={onCancel} className="cancel-button">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default LoadingPopup;
