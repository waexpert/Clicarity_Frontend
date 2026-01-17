import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

// Flattened initial state
const initialState = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone_number: "",
  country: "",
  currency: "",
  is_verified: false,
  isAuthenticated: false,
  schema_name :""
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      userRegistration: (state, action) => {
        console.log('User registration payload:', action.payload); 
        // Flattened structure update
        state.id = action.payload.id;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.phone_number = action.payload.phone_number;
        state.country = action.payload.country;
        state.currency = action.payload.currency;
        state.is_verified = action.payload.is_verified;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.schema_name = action.payload.schema_name;
        state.owner_id = action.payload.owner_id;
        console.log("after update", state);
      },
      userLogin: (state, action) => {
        state.id = action.payload.id;
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.email = action.payload.email;
        state.password = action.payload.password;
        state.phone_number = action.payload.phone_number;
        state.country = action.payload.country;
        state.currency = action.payload.currency;
        state.is_verified = action.payload.is_verified;
        state.schema_name = action.payload.schema_name;
        state.owner_id = action.payload.owner_id;
        state.isAuthenticated = action.payload.isAuthenticated;
      },
      userLogout: () => {
        return {
          id: "",
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone_number: "",
          country: "",
          currency: "",
          is_verified: false,
          isAuthenticated: false,
          owner_id :"",
          schema_name :""
        };
      },
      setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
        setSchemaName: (state, action) => {
    state.schema_name = action.payload;
  }
    },
  });
  

export const { userRegistration, userLogin, userLogout,setSchemaName,setAuthenticated } = userSlice.actions;
export default userSlice.reducer;
