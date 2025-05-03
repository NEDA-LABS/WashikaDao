import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  showNotificationPopup,
  hideNotificationPopup,
  // removeNotification,
} from "../../redux/notifications/notificationSlice";
// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


// interface NotificationProps {
//   setActiveSection?: (section: string) => void;
// }

export default function Notification() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { isVisible, notifications } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    if (notifications.length > 0) {
      dispatch(showNotificationPopup());
    }
  }, [notifications, dispatch]);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      dispatch(hideNotificationPopup());
    }, 6000);
    return () => clearTimeout(timer);
  }, [isVisible, dispatch]);


  // const handleView = (note: typeof notifications[0]) => {
  //   // 1) if it's a section‑switch in SuperAdmin
  //   if (note.section && setActiveSection) {
  //     setActiveSection(note.section);
  //   }
  //   // 2) otherwise if it's a link
  //   else if (note.link) {
  //     navigate(note.link);
  //   }
  //   // remove from queue
  //   dispatch(removeNotification(note.id));
  // };
  
  return (
    <>
      {isVisible && (
        <div className="notification">
          <div>
            <img src="/images/Info.png" alt="info icon" />
          </div>
          <div className="notifications">
            {notifications.length > 0 ? (
              notifications.map((note) => (
                <div className="notification-item" key={note.id}>
                  <div className="notification-content">
                    <p>{note.message}</p>
                    {/* <button onClick={() => handleView(note)}>View</button> */}
                  </div>
                </div>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </div>
          <div>
          <button onClick={() => dispatch(hideNotificationPopup())}>
              <img src="/images/X.png" alt="cancel icon" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
