import { verifyAccessToken } from "@/src/lib/auth";
import { Product } from "@/src/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
    const accessToken = req.headers.get('Authorization');
    if (!accessToken) {
        return new NextResponse({ message: 'Authorization header is missing' }, { status: 403 });
    }

    const token = accessToken.split(" ")[1];
    const tokenIsValid = await verifyAccessToken(token);

    if (!tokenIsValid) {
        return new NextResponse({ message: 'Forbidden' }, { status: 403 });
    }

    const a = new URL(req.url);

    const productId = a.pathname.split("/").at(-1);

    const selectedProduct = await Product.findOne({ _id: productId });
    
    return NextResponse.json({ message: 'Added', product: selectedProduct }, { status: 200 });
}