/*
import  React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AccountAddress } from "thirdweb/react";
import { RootState } from '../../redux/store';
import {
  addNotification,
  removeNotification,
  showNotificationPopup,
} from "../../redux/notifications/notificationSlice";

export default function AddMSigners() {
         const dispatch = useDispatch(); 
         const [isSubmitting, setIsSubmitting] = useState(false);

        const notifyOnCreation = (type: "success" | "error", message: string) => {
            const id = crypto.randomUUID();
            dispatch(
                addNotification({
                  id,
                  type,
                  message,
                  section: "multisig",
                })
            );
            dispatch(showNotificationPopup());
            setTimeout(() => {
                dispatch(removeNotification(id));
            }
            , 5000);
        };

        const { currentChairAddr, currentTreasurerAddr, currentCreatorAddr } = useSelector((state: RootState) => state.multisigners);

    return (
        <div>
   <h1> Add Multisig Members </h1> 
      <form 
      onSubmit={(e) => {
        e.preventDefault(); 
        handleAddMultiSigners();
        setIsSubmitting(true);
        notifyOnCreation("success", "Multisig members added successfully!");
      }}>
          <MsignersForm.AddMSignersForm
            isSubmitting={isSubmitting}
            onCancel={() => setIsSubmitting(false)}
            currentChairAddr={currentChairAddr}
            currentTreasurerAddr={currentTreasurerAddr}
            currentCreatorAddr={currentCreatorAddr}
          />
      </form>

        </div>
   
    );

}
*/