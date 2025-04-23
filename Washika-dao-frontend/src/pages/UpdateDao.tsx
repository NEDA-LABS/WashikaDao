import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { BASE_BACKEND_ENDPOINT_URL, ROUTE_PROTECTOR_KEY } from "../utils/backendComm.ts";
import { useActiveAccount } from "thirdweb/react";
// import Step2Form from "../components/DaoRegistration/Step2Form";
// import Step3Members from "../components/DaoRegistration/Step3Members";

/**
 * @Auth Policy -> Check if user is authenticated definitely should be before being allowed access to this page ---> If Dao Registration successful should be redirected to the page with the dao admin page
 */
interface FormData {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  daoRegDocs: string;
  kiwango: number;
  accountNo: number;
  nambaZaHisa: string;
  kiasiChaHisa: string;
  interestOnLoans: string;
}

const uploadFileToCloudinary = async (file: File, resourceType: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const uploadUrl = `https://api.cloudinary.com/v1_1/da50g6laa/${resourceType}/upload`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return data.secure_url; // Return the uploaded file's URL
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

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
const UpdateDao: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token") ?? "";
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();
  const {  phoneNumber } = useSelector(
    (state: RootState) => state.user
  );
    const activeAccount = useActiveAccount();
        const memberAddr = activeAccount?.address;

  useEffect(() => {
    if (typeof memberAddr === "string") {
      setFormData((prevData) => ({
        ...prevData,
        multiSigAddr,
      }));
    }
  }, [memberAddr, multiSigAddr]);

  const [formData, setFormData] = useState<FormData>({
    daoName: "",
    daoLocation: "",
    targetAudience: "",
    daoTitle: "",
    daoDescription: "",
    daoOverview: "",
    daoImageIpfsHash: "",
    daoRegDocs: "",
    kiwango: 0,
    accountNo: 0,
    nambaZaHisa: "",
    kiasiChaHisa: "",
    interestOnLoans: "",
  });

  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, phoneNumber]);

  // Handle changes in the main form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target; // Destructure the target name and value
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the specific field in the form data
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0]; // Access the file if it exists
    const fieldName = target.name;

    if (file) {
      const resourceType = fieldName === "daoImageIpfsHash" ? "image" : "raw"; // Use 'raw' for non-image files
      const fileUrl = await uploadFileToCloudinary(file, resourceType);

      if (fileUrl) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: fileUrl, // Update the specific field with the file URL
        }));
      }
    }
  };

  const fetchDaoDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/GetDaoDetailsByDaoTxHash/?daoTxHash=${multiSigAddr}`,
        {
          headers: {
            Authorization: token,

            "X-API-KEY": ROUTE_PROTECTOR_KEY,

            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch DAO details");
      }
      const data = await response.json();
      console.log(data);

      setFormData((prevData) => ({
        ...prevData,
        ...data.daoDetails, // Merge existing state with fetched data
      }));
    } catch (error) {
      console.error("Error fetching DAO details:", error);
    }
  };

  // Fetch DAO details on component mount
  useEffect(() => {
    if (multiSigAddr) {
      fetchDaoDetails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiSigAddr, token]);
  // console.log(formData);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Ensure multiSigAddr is properly set
    // if (!formData.multiSigAddr || formData.multiSigAddr.trim() === "") {
    //  alert("MultiSig Address is required");
    //   return;
    // }
    if (!memberAddr) {
      alert("Member Address is required");
      return;
    }

    setIsSubmitting(true); // Set loading state to true
    try {
      // Send combined data to the backend API
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/Daokit/DaoDetails/UpdateDaoDetails/?daoTxHash=${multiSigAddr}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log(data);
      // Parse the response JSON
      // Check if the response indicates success
      if (response.ok) {
        alert("Dao updated successfully");
        console.log("DAO updated successfully", data);

        navigate(`/SuperAdmin/${multiSigAddr}`); // Navigate to the DAO profile pagehandleSubmit(event);
      } else {
        console.error("Error updating DAO:", data.message);
      }
    } catch (error) {
      console.error("Error updating DAO:", error);
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };
  //TODO: Fix below to check including role
  return (
    <>
      <NavBar className={"DaoRegister"} />
      {memberAddr ? ( // Only show form if user is logged in
        <main className="daoRegistration">
          <div className="funguaKikundi">
            <h1>
              GO ahead! <br />
              Update your DAO with a simple Step-by-step form
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
            {/* <DaoForm
              className="form one"
              title="Update Dao"
              description="Update the details of your DAO"
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
                  label: "Bank account number",
                  type: "number",
                  name: "accountNo",
                  value: formData.accountNo,
                  onChange: handleChange,
                },
              ]}
            /> */}

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
                      type: "text",
                      name: "nambaZaHisa",
                      value: formData.nambaZaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Amount per SHARE",
                      type: "text",
                      name: "kiasiChaHisa",
                      value: formData.kiasiChaHisa,
                      onChange: handleChange,
                    },
                    {
                      label: "Loan Interest",
                      type: "text",
                      name: "interestOnLoans",
                      value: formData.interestOnLoans,
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
                      value: formData.daoImageIpfsHash,
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                    {
                      label: "Upload Registration Documents",
                      type: "file",
                      name: "daoRegDocs",
                      value: formData.daoRegDocs,
                      onChange: (e) =>
                        handleFileChange(
                          e as React.ChangeEvent<HTMLInputElement>
                        ), // File input handler
                    },
                  ],
                },
              ]}
            />

            <center>
              <button
                disabled={isSubmitting}
                className={`createDao ${isSubmitting ? "loading" : ""}`}
                type="submit"
              >
                Update DAO
              </button>
            </center>
          </form>
        </main>
      ) : (
        <p className="daoRegistration">
          Please log in to update your Dao Contract
        </p>
      )}
      <Footer className={""} />
    </>
  );
};

export default UpdateDao;
