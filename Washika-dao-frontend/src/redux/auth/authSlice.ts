import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  address: string | null;
}

const initialState: AuthState = {
  address: localStorage.getItem("address") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      localStorage.setItem("address", action.payload);
    },
    logout: (state) => {
      state.address = null;
      localStorage.removeItem("address");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
