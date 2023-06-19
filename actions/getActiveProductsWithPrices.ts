/*
   This code defines an async function named getActiveProductsWithPrices that creates a Supabase client using an imported function and provided cookies function, 
   
   retrieves data from the “products” table using chained Supabase methods with provided arguments, checks for errors and logs them to console if any, and returns the data or 
   
   an empty array if data is falsy.
*/

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { ProductWithPrice } from "@/types";

// defines an async function named getActiveProductsWithPrices that returns a Promise of an array of ProductWithPrice objects.
const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  // creates a Supabase client using the provided cookies function.
  const supabase = createServerComponentClient({
    cookies: cookies
  });

  /* 
    This line of code uses the Supabase client to query the “products” table in the database and retrieve data.

    const { data, error } = destructures the returned object into data and error variables.

    await supabase.from("products") selects the “products” table from the database.

    .select("*, prices(*)") selects all columns from the “products” table and all columns from the related “prices” table using a PostgREST syntax for selecting related data.

    .eq("active", true) filters the results to only include rows where the “active” column is true.

    .eq("prices.active", true) filters the related “prices” data to only include rows where the “active” column is true.

    .order("metadata->index") orders the results by the “index” property of the JSON “metadata” column.

    .order("unit_amount", { foreignTable: "prices" }) orders the related “prices” data by the “unit_amount” column.

    In summary, this line of code uses the Supabase client to query the “products” table in the database, selecting all columns and related “prices” data, 
    
    filtering by the “active” column in both tables, and ordering by the “index” property of the JSON “metadata” column and the “unit_amount” column of the related “prices” data, 
    
    and destructures its return value into data and error variables.
  
  */
  const { data, error } = await supabase.from("products").select("*, prices(*)").eq("active", true).eq("prices.active", true).order("metadata->index").order("unit_amount", { foreignTable: "prices" });

  // checks if error is truthy and if so, logs its message to console.
  if (error) {
    console.log(error.message);
  }

  // returns data cast as any or an empty array if data is falsy.
  return (data as any) || [];
};

export default getActiveProductsWithPrices;
