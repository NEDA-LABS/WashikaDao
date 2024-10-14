"use client";
import Footer from "@/components/Footer";
import DaoForm from "@/components/DaoForm";
import NavBar from "@/components/NavBar";
import MemberForm from "@/components/MemberForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "@/styles/DaoRegistration.css";

interface FormData {
  daoName: string;
  daoLocation: string;
  targetAudience: string;
  daoTitle: string;
  daoDescription: string;
  daoOverview: string;
  daoImageIpfsHash: string;
  multiSigAddr: string;
}

interface Member {
  name: string;
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
  const router = useRouter(); // Initialize navigation hook

  const [formData, setFormData] = useState<FormData>({
    daoName: "",
    daoLocation: "",
    targetAudience: "",
    daoTitle: "",
    daoDescription: "",
    daoOverview: "",
    daoImageIpfsHash: "",
    multiSigAddr: "",
  });

  // State to hold the list of members
  const [members, setMembers] = useState<Member[]>([]);

  // Temporary state to hold the current member's input values
  const [currentMember, setCurrentMember] = useState<Member>({
    name: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
  });

  // Handle changes in the main form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      currentMember.name &&
      currentMember.phoneNumber &&
      currentMember.nationalIdNo &&
      currentMember.memberRole
    ) {
      // Push the current member to the members array
      setMembers([...members, currentMember]);

      // Clear the currentMember form for new input
      setCurrentMember({
        name: "",
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
      const data = await response.json(); // Parse the response JSON

            // Check if the response indicates success
      if (response.ok) {
        const daoMultisigAddr = data.daoMultisigAddr; // Extract multi-sig address from response
        console.log("DAO created successfully", data);
        router.push(`/DaoProfile/${daoMultisigAddr}`); // Navigate to the DAO profile page
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
      <main className="daoRegistration">
        <div className="funguaKikundi">
          <h1>Fungua Kikundi chako kirahisi, upate faida kibao</h1>
          <p>
            Tumia teknolojia yetu kuunda, kuendesha, na kuboresha kikundi chako
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
          <div className="line"></div>
          <div className="circle">5</div>
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
                label: "",
                type: "file",
                name: "daoImageIpfsHash",
                onChange: (e) => handleFileChange(e as React.ChangeEvent<HTMLInputElement>),  // File input handler
                },
            ]}
          />

          {/* Pass members state and handlers to the MemberForm */}
          <MemberForm
            currentMember={currentMember}
            onMemberChange={handleMemberChange}
            onAddMember={handleAddMember}
          />

          <DaoForm
            className="hazina"
            title="Hazina ya kikundi"
            description="Taarifa na maelezo ya kifedha ya kikundi"
            fields={[
              {
                label: "Unganisha multi-sig wallet/acc for your kikundi",
                type: "button",
                name: "connect-wallet",
                id: "connect-wallet",
                // onClick: async () => {
                //   try {
                //     // Logic to connect wallet using a web3 provider (e.g., MetaMask)
                //     const provider = new ethers.providers.Web3Provider(window.ethereum);
                //     const accounts = await provider.send("eth_requestAccounts", []);
                //     const walletAddress = accounts[0];
                //     setFormData((prevData) => ({
                //       ...prevData,
                //       multiSigAddr: walletAddress,
                //     }));
                //     console.log("Wallet connected:", walletAddress);
                //   } catch (error) {
                //     console.error("Wallet connection failed:", error);
                //   }
                // },
              },
              {
                label: "Andika akaunti namba ambayo itapokea fedha za kikundi",
                type: "text",
                name: "multiSigAddr",
                value: formData.multiSigAddr,
                onChange: handleChange,
              },
            ]}
          />
          <div className="button-container">
            <button className="createDao" type="submit">
              Create DAO
            </button>
          </div>
        </form>
      </main>
      {/* Add your own components here, I am testing here */}
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
