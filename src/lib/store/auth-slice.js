"use client";

const { createSlice } = require("@reduxjs/toolkit");

const getAccessToken = () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) return token;
    }
    
    return "";
};

const initialAuthState = {
    accessToken: getAccessToken()
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState: initialAuthState,
    reducers: {
        getNewAccessToken(state,action) {
            state.accessToken = action.payload;
        }
    }
});

export default authSlice;
export const authSliceActions = authSlice.actions;