import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { toggleNotificationPopup } from "../../redux/notifications/notificationSlice";

export default function Notification() {
    const isVisible = useSelector(
        (state: RootState) => state.notification.isVisible
      );
      const dispatch = useDispatch();
    
  return (
    <>
      {isVisible && (
        <div className="notification">
          <div>
            <img src="/images/Info.png" alt="info icon" />
          </div>
          <div className="notifications">
            <h3>Notification</h3>
            <p>New Member Request</p>
            <button>View</button>
          </div>
          <div>
            <button onClick={() => dispatch(toggleNotificationPopup())}>
              <img src="/images/X.png" alt="cancel icon" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
