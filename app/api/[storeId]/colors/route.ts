import prismadb from "@/lib/prismadb";
import primadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (
    req: Request,
    { params} : { params: {storeId: string}}

){
    try {
        const { userId} = auth();
        const body = await req.json();

        const { name , value } = body;

        if (!userId) {
            return new NextResponse("Non authentifié", {status: 401})
        }

        if(!name) {
            return new NextResponse ("La couleur est obligatoire", {status: 400})
        }

        if(!value) {
            return new NextResponse ("La vouleur est obligatoire", {status: 400})
        }

        if(!params.storeId){
            return new NextResponse ("La Boutique est obligatoire", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Non autorisé", { status: 403})
        }

        const color = await primadb.color.create({
            data:{
                name,
                value, 
                storeId: params.storeId
            }
        });

        return NextResponse.json(color);

    }catch (error){
        console.log('[COLORS_POST]', error);
        return new NextResponse("Interal error", {status: 500});
    }
}



export async function GET (
    req: Request,
    { params} : { params: {storeId: string}}

){
    try {

        if(!params.storeId){
            return new NextResponse ("La Boutique est obligatoire", {status: 400})
        }

        const colors = await primadb.color.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(colors);

    }catch (error){
        console.log('[COLORS_GET]', error);
        return new NextResponse("Interal error", {status: 500});
    }
}