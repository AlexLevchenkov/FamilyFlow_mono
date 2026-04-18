import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={`button ${variant === "primary" ? "button__primary" : "button__secondary"}`}
      {...props}
    >
      {props.children}
    </button>
  );
} 
