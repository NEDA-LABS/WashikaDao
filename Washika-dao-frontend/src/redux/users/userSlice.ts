// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  memberAddr: string | null;
  daoMultiSig: string | undefined;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: number;
  nationalIdNo: number | string | undefined;
}

const initialState: UserState = {
  memberAddr: null,
  daoMultiSig: undefined,
  firstName: '',
  lastName: '',
  role: '',
  email: "",
  phoneNumber: 0,
  nationalIdNo: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserState>) {
      // Mutate state directly by assigning values from action.payload
      state.memberAddr = action.payload.memberAddr;
      state.daoMultiSig = action.payload.daoMultiSig;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.nationalIdNo = action.payload.nationalIdNo;
    },
    clearCurrentUser(state) {
      // Reset state to initial state values
      state.memberAddr = initialState.memberAddr;
      state.daoMultiSig = initialState.daoMultiSig;
      state.firstName = initialState.firstName;
      state.lastName = initialState.lastName;
      state.role = initialState.role;
      state.email = initialState.email;
      state.phoneNumber = initialState.phoneNumber;
      state.nationalIdNo = initialState.nationalIdNo;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
