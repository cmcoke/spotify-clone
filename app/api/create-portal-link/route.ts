/*
  This code defines an async function to handle a POST request in a Next.js serverless function by creating a Supabase client, retrieving user data using Supabase’s auth.getUser method, 
  
  calling an imported function to create or retrieve a customer, creating a new Stripe billing portal session with provided data and generated URL, and returning appropriate responses.
*/

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST() {
  try {
    // creates a Supabase client using the provided cookies function.
    const supabase = createRouteHandlerClient({
      cookies
    });

    // retrieves the user data using Supabase’s auth.getUser method.
    const {
      data: { user }
    } = await supabase.auth.getUser();

    // checks if the user data is falsy and if so, throws an error with a “Could not get user” message.
    if (!user) throw Error("Could not get user");

    // calls the createOrRetrieveCustomer function with the user’s id and email, if they exist, or empty strings if not.
    const customer = await createOrRetrieveCustomer({
      uuid: user.id || "",
      email: user.email || ""
    });

    // checks if the customer data is falsy and if so, throws an error with a “Could not get customer” message.
    if (!customer) throw Error("Could not get customer");

    // creates a new Stripe billing portal session with the provided customer and return_url generated using the getURL function.
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`
    });

    // returns a new NextResponse with the url set to the url of the created session.
    return NextResponse.json({ url });

    // catches any errors thrown by the previous code, logs them to console, and returns a new NextResponse with an error message and 500 status code.
  } catch (err: any) {
    console.log(err);
    new NextResponse("Internal Error", { status: 500 });
  }
}
