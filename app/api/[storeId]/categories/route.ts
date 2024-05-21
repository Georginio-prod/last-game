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

        const { name , billboardId } = body;

        if (!userId) {
            return new NextResponse("Non authentifié", {status: 401})
        }

        if(!name) {
            return new NextResponse ("Nom est obligatoire", {status: 400})
        }

        if(!billboardId) {
            return new NextResponse ("L'exposition de l'image est obligatoire", {status: 400})
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

        const category = await primadb.category.create({
            data:{
                name,
                billboardId, 
                storeId: params.storeId
            }
        });

        return NextResponse.json(category);

    }catch (error){
        console.log('[CATEGORIES_POST]', error);
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

        const categorries = await primadb.category.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(categorries);

    }catch (error){
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Interal error", {status: 500});
    }
}