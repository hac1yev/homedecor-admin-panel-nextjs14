import { connectToDB } from "@/src/lib/connectToDB";
import { Admin } from "@/src/models/Admin";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { email,password } = await req.json();

    await connectToDB();

    const admin = await Admin.findOne({ email });

    if(!admin) {
        return NextResponse.json({ message: 'Email is not correct' }, { status: 401 });
    }
    
    const isPasswordCorrect = await compare(password, admin.password);

    if(!isPasswordCorrect) {
        return NextResponse.json({ message: 'Password is not correct' }, { status: 401 });
    }

    const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const refreshSecretKey = new TextEncoder().encode(process.env.REFRESH_SECRET_KEY);

    const accessToken = await new SignJWT({ 
        email 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30s')
    .sign(jwtSecretKey);

    const refreshToken = await new SignJWT({ 
        email 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(refreshSecretKey);
                                                                        
    const response = NextResponse.json({ message: "Login successfully!", accessToken }, { status: 200 });

    response.cookies.set({
        name: 'refreshToken',
        value: refreshToken,
        path: '/',
        httpOnly: true,
        secure: true   
    });

    return response;
}