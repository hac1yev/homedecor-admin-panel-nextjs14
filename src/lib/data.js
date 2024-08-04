import { Product } from "../models/Product";
import { User } from "../models/User";
import { connectToDB } from "./connectToDB";

export async function getProducts(q,page) {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 5;
    
    try {
        connectToDB();
        const count = await Product.find({ 
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { f_collection: { $regex: regex } },
                { furniture: { $regex: regex } }
            ]
         }).count();
        const data = await Product.find({ 
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { f_collection: { $regex: regex } },
                { furniture: { $regex: regex } }
            ]
         }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));

        const products = JSON.parse(JSON.stringify(data));
        
        return { products, count };
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch products!');
    }
}

export async function getUsers(q,page) {
    const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 5;
    
    try {
        connectToDB();
        const count = await User.find({ 
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } },
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } }
            ]
         }).count();
        const data = await User.find({ 
            $or: [
                { username: { $regex: regex } },
                { email: { $regex: regex } },
                { firstName: { $regex: regex } },
                { lastName: { $regex: regex } }
            ]
        }).limit(ITEM_PER_PAGE).skip(ITEM_PER_PAGE * (page - 1));

        const users = JSON.parse(JSON.stringify(data));
        
        return { users, count };
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch users!');
    }
}