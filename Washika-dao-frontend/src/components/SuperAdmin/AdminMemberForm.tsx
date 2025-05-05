// import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";
import { useActiveAccount } from "thirdweb/react";
// import DaoForm from "../DaoForm";
import MemberForm from "../MemberForm";
import { useMemberManagement } from "../../hooks/useMemberManagement";

export function AdminMemberForm() {
  const activeAccount = useActiveAccount();
  const address = activeAccount?.address;
  const dispatch = useDispatch();
  const rawDaoId = localStorage.getItem("daoId") as `0x${string}` | null;
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
    useMemberManagement(rawDaoId ?? undefined, address, notify);
  return (
    <>
      {/* Render form popup when Add Member is clicked */}

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
    </>
  );
}
