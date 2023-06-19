/*
   This code defines an async function to handle a POST request in a Next.js serverless function by retrieving data from the request body, creating a Supabase client, retrieving user data using Supabase’s auth.getUser method, 
   
   calling an imported function to create or retrieve a customer, creating a new Stripe checkout session with provided data and generated URLs, and returning appropriate responses.
*/

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST(request: Request) {
  // retrieves the price, quantity (defaulting to 1), and metadata (defaulting to an empty object) properties from the request body as JSON.
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    // creates a Supabase client using the provided cookies function
    const supabase = createRouteHandlerClient({
      cookies
    });
    const {
      data: { user }
    } = await supabase.auth.getUser(); // Retrieves the user data using Supabase’s auth.getUser method.

    // Calls the createOrRetrieveCustomer function with the user’s id and email, if they exist, or empty strings if not.
    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || "",
      email: user?.email || ""
    });

    // Creates a new Stripe checkout session with the provided customer, price, quantity, and metadata values, and success and cancel URLs generated using the getURL function.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity
        }
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`
    });

    // returns a new NextResponse with the sessionId set to the id of the created session.
    return NextResponse.json({ sessionId: session.id });
    // Catches any errors thrown by the previous code, logs them to console, and returns a new NextResponse with an error message and 500 status code.
  } catch (err: any) {
    console.log(err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
