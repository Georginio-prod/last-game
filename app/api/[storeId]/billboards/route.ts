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

        const { label , imageUrl } = body;

        if (!userId) {
            return new NextResponse("Non authentifié", {status: 401})
        }

        if(!label) {
            return new NextResponse ("L'étiquête est obligatoire", {status: 400})
        }

        if(!imageUrl) {
            return new NextResponse ("L'Url de l'image est obligatoire", {status: 400})
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

        const billboard = await primadb.billboard.create({
            data:{
                label,
                imageUrl, 
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    }catch (error){
        console.log('[BILLBOARDS_POST]', error);
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

        const billboards = await primadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            }
        });

        return NextResponse.json(billboards);

    }catch (error){
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Interal error", {status: 500});
    }
}