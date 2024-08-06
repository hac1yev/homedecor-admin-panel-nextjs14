import { verifyAccessToken } from "@/src/lib/auth";
import { connectToDB } from "@/src/lib/connectToDB";
import { Product } from "@/src/models/Product";
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
        const ITEM_PER_PAGE = 5;

        await connectToDB();

        const count = await Product.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { f_collection: { $regex: regex } },
                { furniture: { $regex: regex } }
            ]
        }).countDocuments();

        const data = await Product.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { f_collection: { $regex: regex } },
                { furniture: { $regex: regex } }
            ]
        }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));

        const products = JSON.parse(JSON.stringify(data));
        return NextResponse.json({ products, count }, { status: 200 });

    } catch (error) {
        return NextResponse.error({ message: 'Internal Server Error' }, { status: 500 });
    }
}