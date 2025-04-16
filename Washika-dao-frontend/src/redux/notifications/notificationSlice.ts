import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  type: string;
  message: string;
  link?: string;
  section?: string;
}

interface NotificationState {
  isVisible: boolean;
  notifications: Notification[];
}

const initialState: NotificationState = {
  isVisible: false,
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotificationPopup(state) {
      state.isVisible = true;
    },
    hideNotificationPopup(state) {
      state.isVisible = false;
    },
    toggleNotificationPopup(state) {
      state.isVisible = !state.isVisible;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const {
  showNotificationPopup,
  hideNotificationPopup,
  toggleNotificationPopup,
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
