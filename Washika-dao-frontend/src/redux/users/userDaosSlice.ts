// src/redux/userDaosSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnchainDao } from "../../utils/Types";

// Import the Dao type from your hook (or define it here if preferred)
export type DaoRoleEnum =
  | "Chairperson"
  | "Secretary"
  | "Treasurer"
  | "Member"
  | "Funder";

interface UserDaosState {
  daos: OnchainDao[];
}

const initialState: UserDaosState = {
  daos: [],
};

const userDaosSlice = createSlice({
  name: "userDaos",
  initialState,
  reducers: {
    setUserDaos(state, action: PayloadAction<OnchainDao[]>) {
      state.daos = action.payload;
    },
    clearUserDaos(state) {
      state.daos = [];
    },
  },
});

export const { setUserDaos, clearUserDaos } = userDaosSlice.actions;
export default userDaosSlice.reducer;
