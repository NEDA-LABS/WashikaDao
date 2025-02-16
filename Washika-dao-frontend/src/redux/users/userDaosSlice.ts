// src/redux/userDaosSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Dao } from "../../utils/Types";

// Import the Dao type from your hook (or define it here if preferred)
export type DaoRoleEnum =
  | "Chairperson"
  | "Secretary"
  | "Treasurer"
  | "Member"
  | "Funder";

interface UserDaosState {
  daos: Dao[];
}

const initialState: UserDaosState = {
  daos: [],
};

const userDaosSlice = createSlice({
  name: "userDaos",
  initialState,
  reducers: {
    setUserDaos(state, action: PayloadAction<Dao[]>) {
      state.daos = action.payload;
    },
  },
});

export const { setUserDaos } = userDaosSlice.actions;
export default userDaosSlice.reducer;
