import Footer from "../components/Footer";
import DaoForm from "../components/DaoForm";
import NavBar from "../components/NavBar";
import MemberForm from "../components/MemberForm";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

const DaoRegistration: React.FC = () => {
  const navigate = useNavigate();

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

  const [members, setMembers] = useState<Member[]>([]);

  // Temporary state to hold the current member's input values
  const [currentMember, setCurrentMember] = useState<Member>({
    name: "",
    phoneNumber: "",
    nationalIdNo: "",
    memberRole: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle change for members
  const handleMemberChange = (field: keyof Member, value: string) => {
    setCurrentMember((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Combine form data and member data
    const combinedData = {
      ...formData,
      members,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/FunguaDao/createDao",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(combinedData), // Send combined data
        }
      );
      const data = await response.json();


      if (response.ok) {
        const daoId = data.daoId;
        console.log("DAO created successfully", data);
        navigate(`/daoProfile/${daoId}`);
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
                value: formData.daoImageIpfsHash,
                onChange: handleChange,
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
                onClick: () => {
                  // Handle wallet connection logic
                },
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
      <Footer className={""} />
    </>
  );
};

export default DaoRegistration;
