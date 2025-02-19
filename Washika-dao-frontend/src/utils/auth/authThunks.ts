// src/features/auth/authThunks.ts

import { logout } from "../../redux/auth/authSlice";
import { AppDispatch } from "../../redux/store";
import { clearUserDaos } from "../../redux/users/userDaosSlice";
import { clearCurrentUser } from "../../redux/users/userSlice";

export const logoutUser = () => (dispatch: AppDispatch) => {
  // Clear authentication data
  dispatch(logout());
  // Clear user profile data
  dispatch(clearCurrentUser());
  // Clear user DAOs data
  dispatch(clearUserDaos());
  // Optionally, clear any other storage (for example, a token)
  localStorage.clear();
};
