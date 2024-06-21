import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }) {
  try {
    const { productIds } = await req.json();

    console.log('productIds:', productIds);

    if (!productIds || productIds.length === 0) {
      return new NextResponse("Les produits sont requis", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    console.log('products:', products);

    if (products.length === 0) {
      return new NextResponse("Aucun produit trouvé", { status: 404 });
    }

    // Calculer le prix total
    const totalPrice = products.reduce((total, product) => total + product.price.toNumber(), 0);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =[];
    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber() * 100,  
        },
      });
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        storeId: params.storeId,
        totalPrice: totalPrice.toFixed(2),
      },
    });

    console.log('session:', session);

    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        address: session.customer_details?.address?.line1 || '', // Placeholder, update with actual data
        phone: session.customer_details?.phone || '', // Placeholder, update with actual data
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    console.log('order:', order);

    return NextResponse.json({ url: session.url }, {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error in POST /checkout:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
