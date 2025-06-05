import { useNavigate } from "react-router-dom";

const Buttons: React.FC = () => {
    const navigate = useNavigate();

  // Navigate to the DAO registration page when the corresponding button is clicked.
  const handleDaoRegistration = () => {
    navigate("/DaoRegistration");
  };

  // Navigate to the educational page when the corresponding button is clicked.
  const handleJifunzeElimu = () => {
    navigate("/Blogs");
  };
  return (
    <>
      <div className="buttons">
        <button className="button-1" onClick={handleDaoRegistration}>
          Create a DAO
        </button>
        <button className="button-2" onClick={handleJifunzeElimu}>
          What is a DAO?
        </button>
      </div>
    </>
  );
};

export default Buttons;
