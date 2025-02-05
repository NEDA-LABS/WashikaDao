 import { createSlice } from "@reduxjs/toolkit";
interface NotificationState {
  isVisible: boolean;
}
const initialState: NotificationState = {
  isVisible: false,
};
const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    toggleNotificationPopup: (state) => {
      state.isVisible = !state.isVisible;
    },
  },
});
export const { toggleNotificationPopup } = notificationSlice.actions;
export default notificationSlice.reducer;
