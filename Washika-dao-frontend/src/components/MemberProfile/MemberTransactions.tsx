import MemberTransactionPopup from "../SuperAdmin/MemberTransactionPopup";

interface MemberTransactionProps {
    setShowStatement: (value: boolean) => void;
    memberAddr: string;
    showStatement: boolean;
}

const MemberTransactions:React.FC<MemberTransactionProps> = ({setShowStatement, memberAddr, showStatement}) => {
  return (
    <>
      {showStatement && (
        <div className="modal-overlay" onClick={() => setShowStatement(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <MemberTransactionPopup memberAddr={memberAddr} />
            <button
              onClick={() => setShowStatement(false)}
              className="close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberTransactions;
