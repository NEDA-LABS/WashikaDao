// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  memberAddr: string | null;
  daoMultiSig: string | null;
  firstName: string;
  lastName: string;
  role: string;
  // Add any other fields you need for the user
}

const initialState: UserState = {
  memberAddr: null,
  daoMultiSig: null,
  firstName: '',
  lastName: '',
  role: '',
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
    },
    clearCurrentUser(state) {
      // Reset state to initial state values
      state.memberAddr = initialState.memberAddr;
      state.daoMultiSig = initialState.daoMultiSig;
      state.firstName = initialState.firstName;
      state.lastName = initialState.lastName;
      state.role = initialState.role;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
