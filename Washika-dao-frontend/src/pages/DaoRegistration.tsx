import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/Navbar/Navbar.tsx";
import MemberForm from "../components/MemberForm";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { baseUrl } from "../utils/backendComm.ts";
import { useDaoForm } from "../hooks/useDaoForm";
import { useMemberManagement } from "../hooks/useMemberManagement";
import { useCompletedSteps } from "../hooks/useCompletedSteps";
import { useDaoTransaction } from "../hooks/useDaoTransaction.ts";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store.ts";

/**
 * @Auth Policy -> Check if user is authenticated definitely should be before being allowed access to this page ---> If Dao Registration successful should be redirected to the page with the dao admin page
 */

/**
 * DaoRegistration component allows users with the "Chairperson" role to register a new DAO.
 * It manages form data for DAO details and member information, handles file uploads to Cloudinary,
 * and submits the combined data to a backend API for DAO creation.
 *
 * @component
 * @returns {React.ReactElement} The rendered component.
 *
 * @remarks
 * - Utilizes React hooks for state management and side effects.
 * - Uses `useNavigate` from `react-router-dom` for navigation upon successful DAO creation.
 * - Relies on `useSelector` from `react-redux` to access user information from the Redux store.
 *
 * @requires ../components/Footer
 * @requires ../components/DaoForm
 * @requires ../components/NavBar
 * @requires ../components/MemberForm
 *
 * @example
 * <DaoRegistration />
 *
 * @see {@link https://reactjs.org/docs/hooks-intro.html} for more about React hooks.
 */
const DaoRegistration: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const address = useSelector((state: RootState) => state.auth.address);
  const { members, currentMember, handleMemberChange, handleAddMember } = useMemberManagement();
  // Find the chairperson member (if any)
  const chairperson = members.find((member) => member.memberRole === "Chairperson");
  const chairpersonPhone = chairperson ? chairperson.phoneNumber : "";
  
  // Pass the chairpersonPhone into the hook
  const { formData, setFormData, handleChange, handleFileChange } = useDaoForm(chairpersonPhone);
  const completedSteps = useCompletedSteps();
  const { handleCreateDao } = useDaoTransaction();

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Ensure multiSigAddr is properly set
    // if (!formData.multiSigAddr || formData.multiSigAddr.trim() === "") {
    //  alert("MultiSig Address is required");
    //   return;
    // }
    console.log('This is the address',address);
    
    if (!address) {
      alert("Member Address is required");
      return;
    }

    setIsSubmitting(true); // Set loading state to true
    try {
      const daoTxHash = await handleCreateDao(formData);
      if (!daoTxHash) {
        alert("DAO creation on blockchain failed!");
        setIsSubmitting(false);
        return;
      }

      setFormData((prev) => ({ ...prev, daoTxHash }));


        const combinedData = {
          ...formData,
          daoTxHash,
          members,
        };

        // Send combined data to the backend API
        const response = await fetch(`${baseUrl}/DaoGenesis/CreateDao?currentAddr=${address}`, {
          method: "POST", // HTTP method
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          //allow to send request without cors 
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
          },
          body: JSON.stringify(combinedData), // Send combined data
        });
        const data = await response.json();
        console.log(data);
        // Parse the response JSON
        // Check if the response indicates success
        if (response.ok) {
          alert("Dao created successfully");
          console.log("DAO created successfully", data);
          navigate(`/SuperAdmin/${daoTxHash}`); // Navigate to the DAO profile pagehandleSubmit(event);
        } else {
          console.error("Error creating DAO:", data.message);
        }
      
    } catch (error) {
      console.error("Error creating DAO:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };
  //TODO: Fix below to check including role
  return (
    <>
      <NavBar className={"DaoRegister"} />
      {address ? ( // Only show form if user is logged in
        <main className="daoRegistration">
          <div className="funguaKikundi">
            <h1>
              Start here! <br />
              Open your DAO with a simple Step-by-step form
            </h1>
            <p>
              Our platform allows you to manage and govern <br />
              your savings group with ease and transparency
            </p>
          </div>

          <div className="circle-container">
            {Array.from({ length: 5 }, (_, index) => (
              <React.Fragment key={`circle-${index}`}>
                <div
                  className={`circle ${
                    index + 1 <= completedSteps ? "green" : ""
                  }`}
                >
                  {index + 1}
                </div>
                {index < 4 && <div className="line" />}
              </React.Fragment>
            ))}
          </div>

          <form className="combinedForms" onSubmit={handleSubmit}>
            <DaoForm
              className="form one"
              title="Fill this form to your DAO"
              description="Tell us about your group"
              fields={[
                {
                  label: "Name of your Group",
                  type: "text",
                  name: "daoName",
                  value: formData.daoName,
                  onChange: handleChange,
                },
                {
                  label: "Location",
                  type: "text",
                  name: "daoLocation",
                  value: formData.daoLocation,
                  onChange: handleChange,
                },
                {
                  label: "What is your Savings Group about?",
                  type: "text",
                  name: "targetAudience",
                  value: formData.targetAudience,
                  onChange: handleChange,
                },
                {
                  label: "Initial Amount",
                  type: "number",
                  name: "kiwango",
                  value: formData.kiwango === 0 ? "" : formData.kiwango,
                  onChange: handleChange,
                },
                {
                  label: "Bank account number",
                  type: "text",
                  name: "accountNo",
                  value: formData.accountNo,
                  onChange: handleChange,
                },
              ]}
            />

            <DaoForm
              className="form two"
              title="About the group"
              description="Group overview and its objective"
              fields={[
                {
                  label: "Header Bio",
                  type: "text",
                  name: "daoTitle",
                  value: formData.daoTitle,
                  onChange: handleChange,
                },
                {
                  label: "Short description",
                  type: "textarea",
                  name: "daoDescription",
                  value: formData.daoDescription,
                  onChange: handleChange,
                },
                {
                  label: "Additional information if any and Group By-laws",
                  type: "textarea",
                  name: "daoOverview",
                  value: formData.daoOverview,
                  onChange: handleChange,
                },
                {
                  group: true,
                  fields: [
                    {
                      label: "Number of SHARES",
                      type: "number",
                      name: "nambaZaHisa",
                      value: formData.nambaZaHisa === 0 ? "" : formData.nambaZaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Amount per SHARE",
                      type: "number",
                      name: "kiasiChaHisa",
                      value: formData.kiasiChaHisa === 0 ? "" : formData.kiasiChaHisa ,
                      onChange: handleChange,
                    },
                    {   
                      label: "Loan Interest",
                      type: "number",
                      name: "interestOnLoans",
                      value: formData.interestOnLoans === 0 ? "" : formData.interestOnLoans,
                      placeholder: "%",
                      onChange: handleChange,
                    },
                  ],
                  label: "",
                  type: "",
                },
                {
                  label: "",
                  type: "",
                  group: true,
                  fields: [
                    {
                      label: "Profile Image",
                      type: "file",
                      name: "daoImageIpfsHash",
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                    {
                      label: "Upload Registration Documents",
                      type: "file",
                      name: "daoRegDocs",
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                  ],
                },
              ]}
            />

            {/* Pass members state and handlers to the MemberForm */}
            <MemberForm
              currentMember={currentMember}
              onMemberChange={handleMemberChange}
              onAddMember={handleAddMember}
            />

            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                type="submit"
              >
                Create DAO
              </button>
            </center>
          </form>
        </main>
      ) : (
        <p className="daoRegistration">
          Please log in to create a Dao Contract
        </p>
      )}
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
