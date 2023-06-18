/* 
   this code defines a SearchInput component that renders an Input component and updates its value in response to user input.
   
   It uses a debounced version of the input value to update the URL with query parameters and navigate to a search page whenever the input value changes.
*/

"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce<string>(value, 500); // uses the useDebounce hook to create a debounced version of the value state variable with a delay of 500ms

  // uses the useEffect hook to run a side effect whenever the debouncedValue or router variables change
  useEffect(() => {
    // creates a query object with a title property set to the debouncedValue
    const query = {
      title: debouncedValue
    };

    // uses the qs.stringifyUrl function to create a URL string for the /search page with the query object as query parameters
    const url = qs.stringifyUrl({
      url: "/search",
      query
    });

    // uses the router object to navigate to the generated URL
    router.push(url);
  }, [debouncedValue, router]);

  return <Input placeholder="What do you want to listen to?" value={value} onChange={e => setValue(e.target.value)} />;
};
export default SearchInput;
