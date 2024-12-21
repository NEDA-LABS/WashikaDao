import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/NavBar";
import MemberForm from "../components/MemberForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import React from "react";

/**
 * @Auth Policy -> Check if user is authenticated definitely should be before being allowed access to this page ---> If Dao Registration successful should be redirected to the page with the dao admin page
 */
interface FormData {
  // input1: string | number | undefined;
  // input2: string | number | undefined;
  // input3: string | number | undefined;
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  multiSigAddr: string;
  multiSigPhoneNo: number;
  kiwango: number;
}

interface Member {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationalIdNo: string;
  memberRole: string;
}

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

const DaoRegistration: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  //TODO: Extract multiSigAddr from Navbar connectWallet data and save to formData

  const { role, memberAddr, phoneNumber } = useSelector(
    (state: RootState) => state.user
  );
  console.log({ phoneNumber: phoneNumber });
  console.log({ role: role });
  console.log({ memberAddr: memberAddr });

  useEffect(() => {
    if (memberAddr) {
      setFormData((prevData) => ({
        ...prevData,
        multiSigAddr: memberAddr.toLowerCase(),
      }));
    }
  }, [memberAddr]);

  const [formData, setFormData] = useState<FormData>({
    daoName: "",
    daoLocation: "",
    targetAudience: "",
    daoTitle: "",
    daoDescription: "",
    daoOverview: "",
    daoImageIpfsHash: "",
    multiSigAddr: memberAddr?.toLowerCase() || "",
    multiSigPhoneNo: phoneNumber, // Set initial value to daoMultiSig
    kiwango: 0,
    // input1: "",
    // input2: "",
    // input3: "",
  });

  // State to hold the list of members
  const [members, setMembers] = useState<Member[]>([]);

  // Temporary state to hold the current member's input values
  const [currentMember, setCurrentMember] = useState<Member>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
  });
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    let stepsCompleted = 0;

    if (memberAddr) stepsCompleted++;
    if (formData.daoName) stepsCompleted++;
    if (formData.daoTitle) stepsCompleted++;
    if (formData.daoImageIpfsHash) stepsCompleted++;
    if (members.length > 0) stepsCompleted++;

    setCompletedSteps(stepsCompleted);
  }, [formData, memberAddr, members.length, phoneNumber]);

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

  // Handle change for members
  const handleMemberChange = (field: keyof Member, value: string) => {
    setCurrentMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Function to add a member to the members list
  const handleAddMember = () => {
    if (
      currentMember.firstName &&
      currentMember.lastName &&
      currentMember.phoneNumber &&
      currentMember.nationalIdNo &&
      currentMember.memberRole
    ) {
      // Push the current member to the members array
      setMembers([...members, currentMember]);

      // Clear the currentMember form for new input
      setCurrentMember({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        nationalIdNo: "",
        memberRole: "",
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0]; // Access the file if it exists

    if (file) {
      const imageUrl = await uploadImageToCloudinary(file); // Upload the file and get the image URL
      if (imageUrl) {
        setFormData((prevData) => ({
          ...prevData,
          daoImageIpfsHash: imageUrl, // Update the form with the image URL
        }));
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Ensure multiSigAddr is properly set
    if (!formData.multiSigAddr || formData.multiSigAddr.trim() === "") {
      alert("MultiSig Address is required");
      return;
    }

    // Combine form data and member data
    const combinedData = {
      ...formData,
      members,
    };

    try {
      // Send combined data to the backend API
      const response = await fetch(
        "http://localhost:8080/FunguaDao/createDao",
        {
          method: "POST", // HTTP method
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
          body: JSON.stringify(combinedData), // Send combined data
        }
      );
      const data = await response.json();
      console.log(data);
      // Parse the response JSON

      // Check if the response indicates success
      if (response.ok) {
        const daoMultiSigAddr = data.multiSigAddr; // Extract multi-sig address from response
        console.log("DAO created successfully", data);
        navigate(`/PublicDaoProfile/${daoMultiSigAddr}`); // Navigate to the DAO profile page
      } else {
        console.error("Error creating DAO:", data.message);
      }
    } catch (error) {
      console.error("Error creating DAO:", error);
    }
  };

  return (
    <>
      <NavBar className={""} />
      {role === "Owner" ? ( // Only show form if user role is "owner"
        <main className="daoRegistration">
          <div className="funguaKikundi">
            <h1>
              Fungua Kikundi chako <br />
              kirahisi, upate faida kibao
            </h1>
            <p>
              Tumia teknolojia yetu kuunda, kuendesha, <br />
              na kuboresha kikundi chako
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
              title="Jaza fomu hii kufungua kikundi"
              description="Taarifa za awali ya kikundi chako"
              fields={[
                {
                  label: "Jina la kikundi",
                  type: "text",
                  name: "daoName",
                  value: formData.daoName,
                  onChange: handleChange,
                },
                {
                  label: "Mahali kilipo",
                  type: "text",
                  name: "daoLocation",
                  value: formData.daoLocation,
                  onChange: handleChange,
                },
                {
                  label: "Kikundi ni cha kina nani",
                  type: "text",
                  name: "targetAudience",
                  value: formData.targetAudience,
                  onChange: handleChange,
                },
                {
                  label: "Kiwango cha kuanzia",
                  type: "number",
                  name: "kiwango",
                  value: formData.kiwango,
                  onChange: handleChange,
                },
                {
                  label: "Akaunti namba ya fedha",
                  type: "number",
                  name: "accountNo",
                  // value: formData.accountNo,
                  onChange: handleChange,
                },
              ]}
            />

            <DaoForm
              className="form two"
              title="Kuhusu kikundi"
              description="Taarifa za maelezo mafupi kuhusu kikundi chako na nia yenu."
              fields={[
                {
                  label: "Kichwa cha Juu",
                  type: "text",
                  name: "daoTitle",
                  value: formData.daoTitle,
                  onChange: handleChange,
                },
                {
                  label: "Maelezo mafupi/utangulizi",
                  type: "textarea",
                  name: "daoDescription",
                  value: formData.daoDescription,
                  onChange: handleChange,
                },
                {
                  label: "Maerezo marefu",
                  type: "textarea",
                  name: "daoOverview",
                  value: formData.daoOverview,
                  onChange: handleChange,
                },
                {
                  group: true,
                  fields: [
                    {
                      label: "Weka Namba za HISA",
                      type: "text",
                      name: "input1",
                      // value: formData.input1,
                      onChange: handleChange,
                    },
                    {
                      label: "Weka Kiasi cha HISA",
                      type: "text",
                      name: "input2",
                      // value: formData.input2,
                      onChange: handleChange,
                    },
                    {
                      label: "Riba za Mikopo",
                      type: "text",
                      name: "input3",
                      // value: formData.input3,
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
              <button className="createDao" type="submit">
                Create DAO
              </button>
            </center>
          </form>
        </main>
      ) : (
        <p className="daoRegistration">
          You do not have the necessary permissions to register a DAO.
        </p>
      )}
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
