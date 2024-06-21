import prismadb from "@/lib/prismadb";

interface GraphData {
    name: string;
    total: number;
}

export const getGraphRevenue = async (storeId: string) => {
    const paidOders = await prismadb.order.findMany({
        where: {
            storeId, 
            isPaid: true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const monthlyRevenue: {[key: number]: number} = {};

    for (const order of paidOders) {
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber();
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
    }

    const graphData: GraphData[] = [
        { name: "Jan", total: 0 },
        { name: "Feb", total: 0 },
        { name: "Mar", total: 0 },
        { name: "Apr", total: 0 },
        { name: "May", total: 0 },
        { name: "Jun", total: 0 },
        { name: "Jul", total: 0 },
        { name: "Aug", total: 0 },
        { name: "Sep", total: 0 },
        { name: "Oct", total: 0 },
        { name: "Nov", total: 0 },
        { name: "Dec", total: 0 },
    ];

    // Get the current month and the previous month
    const currentMonth = new Date().getMonth();
    const previousMonth = (currentMonth - 1 + 12) % 12;

    // Set default values for the last two months, with one smaller than the other
    const defaultRevenueCurrentMonth = 900; // Value for the current month
    const defaultRevenuePreviousMonth = 500; // Smaller value for the previous month
    graphData[previousMonth].total = defaultRevenuePreviousMonth;
    graphData[currentMonth].total = defaultRevenueCurrentMonth;

    // Update the graphData with the actual revenue data
    for (const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
    }

    return graphData;
};
