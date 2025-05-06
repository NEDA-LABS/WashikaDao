// import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import MemberForm from "../MemberForm";
import { useMemberManagement } from "../../hooks/useMemberManagement";
import LoadingPopup from "../DaoRegistration/LoadingPopup";

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
    }, 60000);
  };

  const { currentMember, handleMemberChange, handleAddMember } =
    useMemberManagement(rawDaoId ?? undefined, address, notify, setIsSubmitting);
  return (
    <>
      {/* Render form popup when Add Member is clicked */}
      {isSubmitting && (
       <LoadingPopup message="Creating Member on-chain…" onCancel={() => setIsSubmitting(false)} />
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitting(true);
          handleAddMember();
        }}
      >
        <MemberForm
          currentMember={currentMember}
          onMemberChange={handleMemberChange}
          onAddMember={handleAddMember}
        />
      </form>
    </>
  );
}
