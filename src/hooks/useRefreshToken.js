"use client";

import axios from "axios";
import { useDispatch } from "react-redux";
import { authSliceActions } from "../lib/store/auth-slice";

const useRefreshToken = () => {
    const dispatch = useDispatch();

    async function refresh() {
        try {
            const response = await axios.get("/api/refresh");
            dispatch(authSliceActions.getNewAccessToken(response.data.newAccessToken));
            localStorage.setItem("accessToken", response.data.newAccessToken);
            return response.data.newAccessToken;
        } catch (error) {
            console.log(error);
        }
    }

    return refresh;
};

export default useRefreshToken;