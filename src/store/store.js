// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "../features/userMethod/userSlice";

// export const store = configureStore({
//   reducer: {
//     user: userReducer  
//   }
// });


import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as default storage
import userReducer from "../features/userMethod/userSlice";
import { combineReducers } from 'redux';

// Persist configuration
const persistConfig = {
  key: "root", // Key to store in localStorage
  storage, // Local storage
};

const rootReducer = combineReducers({
  user: userReducer, // Your user reducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
