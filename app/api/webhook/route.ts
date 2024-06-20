import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Strip-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(", ");

    try {
      const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
        include: {
          orderItems: true,
        },
      });

      console.log('Updated order:', order);

      const productIds = order.orderItems.map(
        (orderItem: { productId: string }) => orderItem.productId
      );

      await prismadb.product.updateMany({
        where: {
          id: {
            in: [...productIds],
          },
        },
        data: {
          isArchived: true,
        },
      });

      return new NextResponse(null, { status: 200 });
    } catch (error) {
      console.error("Error processing checkout session:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
