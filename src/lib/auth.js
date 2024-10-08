import { jwtVerify } from "jose";

export const verifyAccessToken = async (token) => {
    const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    try {
        const { payload } = await jwtVerify(token, jwtSecretKey);

        return payload;
    } catch (error) {
        console.log(error);
        
        return null;
    }
};  

export const verifyRefreshToken = async (token) => {
    const refreshSecretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY);

    try {
        const { payload } = await jwtVerify(token, refreshSecretKey);

        return payload;
    } catch (error) {
        console.log(error);
        
        return null;
    }
};  