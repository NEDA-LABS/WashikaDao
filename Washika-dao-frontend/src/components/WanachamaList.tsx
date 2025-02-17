import React, { useState, useEffect } from "react";
import { baseUrl } from "../utils/backendComm";
import { useParams } from "react-router-dom";

interface Wanachama {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
const WanachamaList = () => {
  const itemsPerPage = 4; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [wanachamaData, setWanachamaData] = useState<Wanachama[]>([]);
  const { daoTxHash } = useParams<{ daoTxHash: string }>();
  const token = localStorage.getItem("token") ?? "";

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://${baseUrl}/DaoKit/MemberShip/AllDaoMembers/?daoTxHash=${daoTxHash}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
          
        ); 
        const data = await response.json();
        if (response.ok) {
          setWanachamaData(data.members);
        } else {
          console.error("Error fetching member count:", data.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [daoTxHash, token]);
  console.log(wanachamaData);
  

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
            <p className="name">{member.firstName} {member.lastName}</p>
            <p className="phoneNo">{member.phoneNumber}</p>
            <button>Manage</button>
          </div>
        ))}
        <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default WanachamaList;
