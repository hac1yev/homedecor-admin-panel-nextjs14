import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ message: 'Logout successfully!' })
    
    response.cookies.set('refreshToken', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: true
    });

    return response;
}