import { format} from "date-fns";
import { fr } from "date-fns/locale"
import React from "react";
import prismadb from "@/lib/prismadb";
import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";




const CategoriesPage = async({
    params
}:{
    params: {storeId : string}
}) => {
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt:'desc'
        }
    })

    const formattedCategories: CategoryColumn [] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(new Date(item.createdAt), "MMM do, yyyy", { locale: fr })
    }))
   
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories} />
            </div> 
        </div>
    )
}


export default CategoriesPage;