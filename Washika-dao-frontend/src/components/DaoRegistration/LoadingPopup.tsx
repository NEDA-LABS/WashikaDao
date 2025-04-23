import React from "react";

export interface LoadingPopupProps {
  onCancel: () => void;
  message?: string;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ onCancel, message }) => (
  <div className="loading-popup">
    <div className="loading-content">
    <p>{message ?? "Processing on‑chain transaction…"}</p>
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
