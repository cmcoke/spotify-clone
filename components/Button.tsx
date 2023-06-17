/* 

  This code defines a Button component that renders a styled button element using Tailwind CSS. 
  
  The forwardRef function is used to support passing a ref to the underlying button element. 
  
  The twMerge function is used to merge multiple sets of Tailwind CSS classes, including base classes, additional classes if the button is disabled, and any additional classes passed down via the className prop. 
  
  The Button component accepts all standard button element props and passes them down to the underlying button element.

*/

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

// Defining the type for the props of the Button component, extending the built-in ButtonHTMLAttributes type
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

// Defining the Button component using the forwardRef function to support passing a ref to the underlying button element
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  // Destructuring the className, children, disabled, and type props from the props object, and getting a ref to the forwarded ref
  ({ className, children, disabled, type = "button", ...props }, ref) => {
    // Returning a button element with merged Tailwind CSS classes and other props passed down
    return (
      <button
        type={type}
        className={twMerge(
          `
      w-full 
      rounded-full 
      bg-green-500
      border
      border-transparent
      px-3 
      py-3 
      disabled:cursor-not-allowed 
      disabled:opacity-50
      text-black
      font-bold
      hover:opacity-75
      transition
    `,
          disabled && "opacity-75 cursor-not-allowed", // Adding additional classes if the button is disabled
          className // Merging with any additional classes passed down via the className prop
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "button"; // Setting the displayName property of the Button component for debugging purposes

export default Button;
