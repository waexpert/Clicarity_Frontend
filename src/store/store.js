import { configureStore } from "@reduxjs/toolkit";
import userReducer  from "../features/userMethod/userSlice";

export const store = configureStore({
    reducer : userReducer
})