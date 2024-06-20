import Stripe from "stripe";

console.log('Stripe API Key:', process.env.STRIPE_API_KEY);

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
    apiVersion: "2024-04-10",
    typescript: true,
});
  