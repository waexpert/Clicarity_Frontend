import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user : {
        id : "",
        first_name : "",
        last_name : "",
        email : "",
        password : "",
        phone_number : "",
        country : "",
        currency : "",
        is_verified : false,
    }
}

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        userRegistration: (state, action) => {
            state.user = {
                id : action.payload.id,
                first_name : action.payload.first_name,
                last_name : action.payload.last_name,
                email : action.payload.email,
                password : action.payload.password,
                phone_number : action.payload.phone_number,
                country : action.payload.country,
                currency : action.payload.currency,
                is_verified : action.payload.is_verified,
            };
        },
        userLogin: (state, action) => {
            state.user = {
                id : action.payload.id,
                first_name : action.payload.first_name,
                last_name : action.payload.last_name,
                email : action.payload.email,
                password : action.payload.password,
                phone_number : action.payload.phone_number,
                country : action.payload.country,
                currency : action.payload.currency,
                is_verified : action.payload.is_verified,
            };
        },
        userLogout: (state) => {
            state.user = {
                id: "",
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                phone_nmuber: "",
                country: "",
                currency: "",
                is_verified: false,
            };
        },
    }
    
})

export const { userRegistration, userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;
