import prismadb from "@/lib/prismadb"

export const getTotalRevenue = async (storeId: string) => {
    const paidOders = await prismadb.order.findMany({
        where: {
            storeId, 
            isPaid: true
        },
        include: {
            orderItems: {
                include:{
                    product: true
                }
            }
        }
    });

    const totalRevenue = paidOders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0);

        return total + orderTotal;
    }, 0);

    return totalRevenue;
}