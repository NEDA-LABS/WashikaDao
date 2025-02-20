// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './users/userSlice';
import notificationReducer from './notifications/notificationSlice';
import authReducer from './auth/authSlice';
import userDaosReducer from './users/userDaosSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
// Define persist configuration
const persistConfig = {
  key: 'user',       // Key specific to user reducer
  storage,           // Specify the storage type (localStorage here)
};

// Persist the user reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure store with the persisted reducer
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    notification: notificationReducer,
    auth: authReducer,
    userDaos: userDaosReducer,
  },
});

// Create persistor to manage persistence
export const persistor = persistStore(store);

// Type definitions for TypeScript support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
