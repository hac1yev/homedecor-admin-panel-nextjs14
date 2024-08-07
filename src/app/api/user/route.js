import { verifyAccessToken } from "@/src/lib/auth";
import { connectToDB } from "@/src/lib/connectToDB";
import { User } from "@/src/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const accessToken = req.headers.get('Authorization');
        if (!accessToken) {
            return new NextResponse({ message: 'Authorization header is missing' }, { status: 403 });
        }

        const token = accessToken.split(" ")[1];
        const tokenIsValid = await verifyAccessToken(token);
        
        if (!tokenIsValid) {
            return new NextResponse({ message: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get('q') || '';
        const page = parseInt(searchParams.get('page'), 10) || 1;
        const regex = new RegExp(q, "i");        
        const ITEM_PER_PAGE = 8;

        await connectToDB();

        const count = await User.find({
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } },
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } }
            ]
        }).countDocuments();

        const data = await User.find({
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } },
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } }
            ]
        }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));

        const users = JSON.parse(JSON.stringify(data));
        return NextResponse.json({ users, count }, { status: 200 });

    } catch (error) {
        return NextResponse.error({ message: 'Internal Server Error' }, { status: 500 });
    }
}


export async function DELETE(req) {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    
    const accessToken = req.headers.get('Authorization');
    if (!accessToken) {
        return new NextResponse({ message: 'Authorization header is missing' }, { status: 403 });
    }

    const token = accessToken.split(" ")[1];
    const tokenIsValid = await verifyAccessToken(token);

    if (!tokenIsValid) {
        return new NextResponse({ message: 'Forbidden' }, { status: 403 });
    }

    await connectToDB();

    await User.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Deleted!' })
}
