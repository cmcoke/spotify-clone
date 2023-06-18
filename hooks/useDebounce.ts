// this file prevents the refetching of songs on every single input that is typed in the search component by using setTimeout() to create a delay

import { useEffect, useState } from "react";

// defines the useDebounce function, which takes a value of generic type T and an optional delay number as arguments and returns a value of type T
function useDebounce<T>(value: T, delay?: number): T {
  // uses the useState hook to create a state variable called debouncedValue and a function to update it called setDebouncedValue
  // initializes the debouncedValue state variable with the value argument
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // uses the useEffect hook to run a side effect whenever the value or delay arguments change
  useEffect(() => {
    // sets a timer to update the debouncedValue state variable with the value argument after the delay has passed (or 500ms if no delay is provided)
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // returns a cleanup function that clears the timer when the component unmounts or before running the effect again
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  // returns the debouncedValue state variable
  return debouncedValue;
}

export default useDebounce;
