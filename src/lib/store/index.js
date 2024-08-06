"use client";

import authSlice from "./auth-slice";

const { configureStore } = require("@reduxjs/toolkit");

export const store = configureStore({
    reducer: {
        authReducer: authSlice.reducer,
    }
});