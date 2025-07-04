// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/userSlice.ts';
import notificationReducer from './notifications/notificationSlice.ts';
import userDaosReducer from './users/userDaosSlice.ts';
import multiSignersReducer from './multisigners/multisigners.ts'; 

// Configure store with the persisted reducer
export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    userDaos: userDaosReducer,
    'multisigners': multiSignersReducer,
  },
});

// Type definitions for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
