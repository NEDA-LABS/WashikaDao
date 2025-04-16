export const LoadingPopup = ({ message }: { message: string }) => (
    <div className="loading-popup">
      <div className="loading-content">
        <p>{message}</p>
        <div className="spinner" />
      </div>
    </div>
  );