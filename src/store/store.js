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
import jobStatusReducer from "../features/productMethod/jobStatusSlice"
import leadStatusReducer from "../features/productMethod/leadStatusSlice"
import { combineReducers } from 'redux';

// Persist configuration
const persistConfig = {
  key: "root", 
  storage, 
};

const rootReducer = combineReducers({
  user: userReducer,
  jobstatus : jobStatusReducer,
  leadstatus : leadStatusReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
