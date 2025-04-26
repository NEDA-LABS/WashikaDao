// import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../../redux/notifications/notificationSlice";
import { useParams } from "react-router-dom";
import { useActiveAccount } from "thirdweb/react";
// import DaoForm from "../DaoForm";
import MemberForm from "../MemberForm";
import { useMemberManagement } from "../../hooks/useMemberManagement";

export function AdminMemberForm() {
  // // Form data state
  // const [firstName, setFirstName] = useState<string>("");
  // const [lastName, setLastName] = useState<string>("");
  // const [email, setEmail] = useState<string>("");
  // const [phoneNumber, setPhoneNumber] = useState<number | string>("");
  // const [nationalIdNo, setNationalIdNo] = useState<number | string>("");
  const token = localStorage.getItem("token") ?? "";
  const { multiSigAddr } = useParams<{ multiSigAddr: string }>();
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const dispatch = useDispatch();
  const notify = (type: "success" | "error", message: string) => {
    dispatch(
      addNotification({
        id: crypto.randomUUID(),
        type,
        message,
        section: "wanachama",
      })
    );
  };

  const {
    currentMember,
    handleMemberChange,
    handleAddMember,
  } = useMemberManagement(multiSigAddr, token, address, notify);
  return (
    <>
      {/* Render form popup when Add Member is clicked */}

      
        <form>
          <MemberForm
            currentMember={currentMember}
            onMemberChange={handleMemberChange}
            onAddMember={handleAddMember}
          />
        </form>
      
    </>
  );
}
