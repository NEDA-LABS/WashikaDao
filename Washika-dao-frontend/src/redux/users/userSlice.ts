// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  memberAddr: string | null;
  daoMultiSig: string | null;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber: number;
}

const initialState: UserState = {
  memberAddr: null,
  daoMultiSig: null,
  firstName: '',
  lastName: '',
  role: '',
  phoneNumber: 0,
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
      state.phoneNumber = action.payload.phoneNumber;
    },
    clearCurrentUser(state) {
      // Reset state to initial state values
      state.memberAddr = initialState.memberAddr;
      state.daoMultiSig = initialState.daoMultiSig;
      state.firstName = initialState.firstName;
      state.lastName = initialState.lastName;
      state.role = initialState.role;
      state.phoneNumber = initialState.phoneNumber;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
