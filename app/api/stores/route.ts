import primadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: { json: () => any; }) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Le nom est obligatoire", { status: 400 });
        }

        const store = await primadb.store.create({
            data: {
                name:name,
                userId:userId,
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
