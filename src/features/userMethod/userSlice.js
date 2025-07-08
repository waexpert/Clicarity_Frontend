import { createSlice } from "@reduxjs/toolkit";

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
        state.isAuthenticated = true;
        state.schema_name = action.payload.schema_name;
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
        state.isAuthenticated = true;
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
            schema_name :""
        };
      },
        setSchemaName: (state, action) => {
    state.schema_name = action.payload;
  }
    },
  });
  

export const { userRegistration, userLogin, userLogout,setSchemaName } = userSlice.actions;
export default userSlice.reducer;
