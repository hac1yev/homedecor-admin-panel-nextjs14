import { verifyRefreshToken } from "@/src/lib/auth";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function GET(req) {
    const refreshToken = req.cookies.get("refreshToken");

    const payload = await verifyRefreshToken(refreshToken?.value);

    if(payload) {
        const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

        const newAccessToken = await new SignJWT({ 
            email: payload.email 
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10s')
        .sign(jwtSecretKey);

        const response = NextResponse.json({ newAccessToken });

        return response;
    }

    return NextResponse.json({ message: 'Refresh token is not valid!' }, { status: 401 });
}