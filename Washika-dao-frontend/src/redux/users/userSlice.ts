// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  memberAddr: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  nationalIdNo: string;
}

const initialState: UserState = {
  memberAddr: null,
  firstName: '',
  lastName: '',
  email: "",
  phoneNumber: "",
  nationalIdNo: "",
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserState>) {
      // Mutate state directly by assigning values from action.payload
      state.memberAddr = action.payload.memberAddr;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
      state.nationalIdNo = action.payload.nationalIdNo;
    },
    clearCurrentUser(state) {
      // Reset state to initial state values
      state.memberAddr = initialState.memberAddr;
      state.firstName = initialState.firstName;
      state.lastName = initialState.lastName;
      state.email = initialState.email;
      state.phoneNumber = initialState.phoneNumber;
      state.nationalIdNo = initialState.nationalIdNo;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
