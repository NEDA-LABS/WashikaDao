import React, { useEffect, useState } from "react";
import { IFetchedBackendDao } from "../../utils/Types";
import { useDispatch } from "react-redux";
import { addNotification, showNotificationPopup, removeNotification } from "../../redux/notifications/notificationSlice";

interface Wanachama {
  id: number;
  email: string;
  wallet: string;
}

export interface DaoDetails extends IFetchedBackendDao {
  daoId: `0x${string}`;
  members?: Wanachama[];
}

// Pagination Component
interface PaginationProps {
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageButtons = () => {
    if (totalPages <= 5) {
      // Display all pages if totalPages <= 5
      return Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        )
      );
    }

    // Display pagination in the format: 1 2 3 ... (totalPages-1) totalPages
    const buttons = [];
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={currentPage === 1 ? "active" : ""}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      buttons.push(<span key="start-ellipsis">...</span>);
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={currentPage === page ? "active" : ""}
        >
          {page}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      buttons.push(<span key="end-ellipsis">...</span>);
    }

    buttons.push(
      <button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        className={currentPage === totalPages ? "active" : ""}
      >
        {totalPages}
      </button>
    );

    return buttons;
  };

  return <div className="Pagination">{renderPageButtons()}</div>;
};

// Wanachama List Component
const WanachamaList: React.FC<{ daoDetails?: DaoDetails }> = ({
  daoDetails,
}) => {
  const itemsPerPage = 5; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [wanachamaData, setWanachamaData] = useState<Wanachama[]>([]);

  useEffect(() => {
    if (daoDetails?.members) {
      setWanachamaData(daoDetails.members);
    }
  }, [daoDetails]);

  const handleCopy = (wallet: string) => {
      if (!wallet) return;
  
      navigator.clipboard.writeText(wallet).then(() => {
        const id = crypto.randomUUID();
        dispatch(
          addNotification({
            id,
            type: "info",
            message: "Address copied to clipboard!",
          })
        );
        dispatch(showNotificationPopup());
        setTimeout(() => {
          dispatch(removeNotification(id));
        }, 4000);
      });
    };

  const totalPages = Math.ceil(wanachamaData.length / itemsPerPage);

  // Get data for the current page
  const paginatedData = wanachamaData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="wanachama">
        {paginatedData.map((member, index) => (
          <div className="mwanachama" key={index}>
            <p className="name">{member.email}</p>
            <div className="address">
              <p className="phoneNo">{member.wallet}</p>
              <button
                    onClick={() => handleCopy(member.wallet)}
                    aria-label="Copy address"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      color: "#555",
                      display: "flex",
                    }}
                  >
                    <img
                      src="/images/copy.png"
                      alt="copy"
                      width={12}
                      style={{ opacity: 0.4 }}
                    />
                  </button>
            </div>

            <button>Manage</button>
          </div>
        ))}
        <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default WanachamaList;
