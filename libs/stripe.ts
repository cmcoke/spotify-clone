// This code creates a new instance of the Stripe object with the provided environment variable and configuration options and exports it for use in other parts of the application.

import Stripe from "stripe";

// creates a new instance of the Stripe object, passing in the value of the STRIPE_SECRET_KEY environment variable or an empty string if it’s not defined, and exports it.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
  appInfo: {
    name: "Spotify Clone",
    version: "0.1.0"
  }
});
