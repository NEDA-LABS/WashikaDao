// import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice.js";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import MemberForm from "../MemberForm.js";
import { useMemberManagement } from "../../hooks/useMemberManagement.js";
import LoadingPopup from "../DaoRegistration/LoadingPopup.js";

export function AdminMemberForm() {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const dispatch = useDispatch();
  const rawDaoId = localStorage.getItem("daoId") as `0x${string}` | null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notify = (type: "success" | "error", message: string) => {
    const id = crypto.randomUUID();
    dispatch(
      addNotification({
        id,
        type,
        message,
        section: "wanachama",
      })
    );
    dispatch(showNotificationPopup());
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, 4000);
  };

  const { currentMember, handleMemberChange, handleAddMember } =
    useMemberManagement(rawDaoId ?? undefined, address, notify, setIsSubmitting);
  return (
    <div style={{position: "relative"}}>
      {/* Render form popup when Add Member is clicked */}
      {isSubmitting && (
       <LoadingPopup message="Creating Member on-chain…" onCancel={() => setIsSubmitting(false)} />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddMember();
        }}
      >
        <MemberForm
          currentMember={currentMember}
          onMemberChange={handleMemberChange}
          onAddMember={handleAddMember}
        />
      </form>
    </div>
  );
}
