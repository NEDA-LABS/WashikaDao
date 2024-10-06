import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

// Upload function for Cloudinary (as before)
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/da50g6laa/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

const CreateProposal: React.FC = () => {
  const navigate = useNavigate();
  const { daoMultiSigAddr } = useParams<{ daoMultiSigAddr: string }>();
  // Extract multiSigAddr from URL params

  // State to manage form data
  const [proposalData, setProposalData] = useState({
    proposalOwner: "",
    proposalTitle: "",
    projectSummary: "",
    proposalDescription: "",
    proposalStatus: "open", // default to 'open'
    amountRequested: "",
    daoMultiSigAddr: daoMultiSigAddr || "", // Populate daoMultiSigAddr from URL params
    numUpvotes: 0, // default value
    numDownvotes: 0, // default value
    fileUrl: "",
  });

  // Handle change for text fields and select dropdown
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProposalData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImageToCloudinary(file);
      if (imageUrl) {
        setProposalData((prevData) => ({
          ...prevData,
          fileUrl: imageUrl,
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:8080/CreateProposal/DaoDetails/${daoMultiSigAddr}/createProposal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(proposalData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const proposalId = data.proposalId;
        console.log(proposalId);
        
        console.log("Proposal created successfully");
        navigate(`/ViewProposal/${daoMultiSigAddr}/${proposalId}`);
      } else {
        console.error("Error creating proposal:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <NavBar className={""} />
      <main className="createProposal">
        <div className="proposalParag">
          <div className="top">
            <h1>Create a proposal</h1>
            <img src="/images/arrow-back.png" alt="arrow-back" />
          </div>

          <p>
            Provide the information voters will need to make their decision
            here.
          </p>
        </div>

        <div className="circle-container">
          <div className="circle one">1</div>
          <div className="line"></div>
          <div className="circle">2</div>
          <div className="line"></div>
          <div className="circle">3</div>
          <div className="line"></div>
          <div className="circle">4</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="label one">
            <label>Owner of the proposal</label>
            <button>Connect wallet</button>
          </div>

          <div className="label two">
            <label>Title of proposal</label>
            <input
              type="text"
              name="proposalTitle"
              value={proposalData.proposalTitle}
              onChange={handleChange}
            />
          </div>

          <div className="label three">
            <label>Summary of project</label>
            <textarea
              name="projectSummary"
              value={proposalData.projectSummary}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="label four">
            <label className="andika">
              Andika taarifa fupi ya mchango wako
            </label>
            <textarea
              name="proposalDescription"
              placeholder="Anza hapa..."
              value={proposalData.proposalDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="label five">
            <label>Amount Requested</label>
            <input
              type="number"
              name="amountRequested"
              value={proposalData.amountRequested}
              onChange={handleChange}
            />
          </div>

          <div className="label">
            <label>Proposal Status</label>
            <select
              name="proposalStatus"
              value={proposalData.proposalStatus}
              onChange={handleChange}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="six">
            <div>
              <input type="file" onChange={handleFileChange} />
            </div>
            <button type="submit">SUBMIT PROPOSAL</button>
          </div>
        </form>
      </main>
      <Footer className={""} />
    </>
  );
};

export default CreateProposal;
