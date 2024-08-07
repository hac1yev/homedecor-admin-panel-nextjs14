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
        const ITEM_PER_PAGE = 8;

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


export async function POST(req) {
    const { image, furniture, price, f_collection, title, description } = await req.json();
    let myNewImage;

    const accessToken = req.headers.get('Authorization');
    if (!accessToken) {
        return new NextResponse({ message: 'Authorization header is missing' }, { status: 403 });
    }

    const token = accessToken.split(" ")[1];
    const tokenIsValid = await verifyAccessToken(token);

    if (!tokenIsValid) {
        return new NextResponse({ message: 'Forbidden' }, { status: 403 });
    }

    // Convert data URL (base64) to binary
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const binaryData = Buffer.from(base64Data, 'base64');    

    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({
          image: binaryData.toString('base64'),
          type: 'base64',
        }),
      });

      const responseData = await response.json();

      myNewImage = responseData.data.link;

    } catch (error) {
      console.log(error);
    }

    await connectToDB();
    
    const newFurniture = new Product({ image: myNewImage, price, title, description, f_collection, furniture });

    await newFurniture.save();
    await Product.findByIdAndUpdate(newFurniture._id, { $inc: { views: 1 } });

    return Response.json({ message: 'Added' }, { status: 201 });
}


export async function DELETE(req) {
    const { searchParams } = new URL(req.url)

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

    await Product.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Deleted!' })
}