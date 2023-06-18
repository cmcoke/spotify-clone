// This code defines an async function to handle Stripe webhook events in a Next.js serverless function by checking if they are relevant, handling them accordingly using imported functions, logging any errors that occur, and returning appropriate responses.

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/libs/stripe";
import { upsertProductRecord, upsertPriceRecord, manageSubscriptionStatusChange } from "@/libs/supabaseAdmin";

// creates a Set of relevant event types to handle.
const relevantEvents = new Set(["product.created", "product.updated", "price.created", "price.updated", "checkout.session.completed", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"]);

// The code then defines and exports an async function named POST that takes a Request object as an argument:
export async function POST(request: Request) {
  const body = await request.text(); // retrieves the body of the request as text.
  const sig = headers().get("Stripe-Signature"); // retrieves the value of the “Stripe-Signature” header.

  // retrieves the value of either the STRIPE_WEBHOOK_SECRET_LIVE or STRIPE_WEBHOOK_SECRET environment variable, whichever is defined.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;

  // declares a variable named event of type Stripe.Event
  let event: Stripe.Event;

  try {
    // checks if either sig or webhookSecret are falsy and if so, returns early.
    if (!sig || !webhookSecret) return;

    // constructs a Stripe event object using the provided body, signature, and webhook secret.
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`); // logs the error message to the console.
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 }); // returns a new NextResponse with an error message and a 400 status code.
  }

  // The code then checks if the event type is in the relevantEvents Set:

  //  checks if the event type is in the relevantEvents Set.
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product); //  calls the upsertProductRecord function with the event data object cast as a Stripe.Product
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price); // calls the upsertPriceRecord function with the event data object cast as a Stripe.Price
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription; // retrieves the subscription and customer from the event data object
          await manageSubscriptionStatusChange(subscription.id, subscription.customer as string, event.type === "customer.subscription.created"); // calls the manageSubscriptionStatusChange function with those values and whether or not it’s a created event.
          break;
        case "checkout.session.completed": // retrieves the checkout session from the event data object, checks if its mode is “subscription”, and if so, retrieves its subscription and customer values and calls manageSubscriptionStatusChange with those values and true for createAction.
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(subscriptionId as string, checkoutSession.customer as string, true);
          }
          break;
        default:
          throw new Error("Unhandled relevant event!"); // If none of the previous cases matched, throws an error with an unhandled relevant event message
      }
    } catch (error) {
      console.log(error);
      return new NextResponse('Webhook error: "Webhook handler failed. View logs."', { status: 400 }); //  Catches any errors thrown by handling events, logs them to console, and returns a new NextResponse with an error message and 400 status code.
    }
  }

  // Finally, if no errors were thrown:

  // Returns a new NextResponse with received set to true and 200 status code.
  return NextResponse.json({ received: true }, { status: 200 });
}
