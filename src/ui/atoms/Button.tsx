import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <button className="text-white p-2 bg-button cursor-pointer"
      {...props}
    >
      {props.children}
    </button>
  );
} 
