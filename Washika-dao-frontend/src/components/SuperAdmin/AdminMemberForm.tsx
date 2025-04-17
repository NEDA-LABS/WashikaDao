import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/notifications/notificationSlice";
import { useParams } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
import {
  BASE_BACKEND_ENDPOINT_URL,
  ROUTE_PROTECTOR_KEY,
} from "../../utils/backendComm";
import DaoForm from "../DaoForm";

interface AdminMemberFormProps {
  setActiveSection: (section: string) => void;
  prevSection: string;
}

export function AdminMemberForm({ setActiveSection, prevSection }: AdminMemberFormProps) {
  // Form data state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number | string>("");
  const [nationalIdNo, setNationalIdNo] = useState<number | string>("");
  const token = localStorage.getItem("token") ?? "";
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Build payload data
    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
      nationalIdNo,
      memberCustomIdentifier: crypto.randomUUID(),
    };

    console.log("Payload:", payload);

    try {
      const response = await fetch(
        `${BASE_BACKEND_ENDPOINT_URL}/DaoKit/MemberShip/AddMember/?daoTxHash=${multiSigAddr}&adminMemberAddr=${address}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": ROUTE_PROTECTOR_KEY,
            Authorization: token,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(`Success: ${result.message}`);
        setActiveSection(prevSection);
        dispatch(
          addNotification({
            id: crypto.randomUUID(),
            type: "success",
            message: `Invited member ${firstName} ${lastName}`,
            section: "wanachama",
          })
        );
        // Re-fetch DAO details to update Memberount and WanachamaList
        // fetchDaoDetails();
      } else {
        console.error(`Error: ${result.error}`);
        dispatch(
          addNotification({
            id: crypto.randomUUID(),
            type: "error",
            message: "`Failed to invite member ${firstName} ${lastName}`",
            section: "wanachama",
          })
        );
      }
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };
  return (
    <>
      {/* Render form popup when Add Member is clicked */}

      <div className="popup">
        <form onSubmit={handleSubmit}>
          <DaoForm
            className="form"
            title="Add Member"
            description=""
            fields={[
              {
                label: "First Name",
                type: "text",
                onChange: (e) => setFirstName(e.target.value),
              },
              {
                label: "Last Name",
                type: "text",
                onChange: (e) => setLastName(e.target.value),
              },
              {
                label: "Email",
                type: "email",
                onChange: (e) => setEmail(e.target.value),
              },
              {
                label: "Phone Number",
                type: "number",
                onChange: (e) => setPhoneNumber(e.target.value),
              },
              {
                label: "National ID",
                type: "number",
                onChange: (e) => setNationalIdNo(e.target.value),
              },
            ]}
          />
          <div className="center">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setActiveSection(prevSection)}>
              Close
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
