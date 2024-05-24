import { format,} from "date-fns";
import { fr} from "date-fns/locale";
import React from "react";
import { ColorsClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { ColorColunm } from "./components/columns";



const COlorsPage = async({
    params
}:{
    params: {storeId : string}
}) => {
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt:'desc'
        }
    })

    const formattedColors: ColorColunm [] = colors.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createdAt: format(new Date(item.createdAt), "MMM do, yyyy", { locale: fr })
    }))
   
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColors} />
            </div> 
        </div>
    )
}


export default COlorsPage;