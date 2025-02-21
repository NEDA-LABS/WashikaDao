// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/userSlice';
import notificationReducer from './notifications/notificationSlice';
import authReducer from './auth/authSlice';
import userDaosReducer from './users/userDaosSlice';

// Configure store with the persisted reducer
export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    auth: authReducer,
    userDaos: userDaosReducer,
  },
});

// Type definitions for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
