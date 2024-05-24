import { format} from "date-fns";
import { fr}  from "date-fns/locale";
import React from "react";
import { BillboardClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { BillboardColumn } from "./components/columns";



const BillboardsPage = async({
    params
}:{
    params: {storeId : string}
}) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt:'desc'
        }
    })

    const formattedBillboards: BillboardColumn [] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(new Date(item.createdAt), "MMM do, yyyy", { locale: fr })
    }))
   
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formattedBillboards} />
            </div> 
        </div>
    )
}


export default BillboardsPage;