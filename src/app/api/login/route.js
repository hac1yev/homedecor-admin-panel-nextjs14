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

    const jwtSecretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

    if(isPasswordCorrect) {
        const accessToken = await new SignJWT({ 
            email 
        })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('10m')
        .sign(jwtSecretKey);
                                                                            
        const response = NextResponse.json({ message: "Login successfully!", accessToken }, { status: 200 });
    
        response.cookies.set({
            name: 'accessToken',
            value: accessToken,
            path: '/'    
        });

        return response;
    }

    return NextResponse.json({ message: 'Password is not correct' }, { status: 401 });
}