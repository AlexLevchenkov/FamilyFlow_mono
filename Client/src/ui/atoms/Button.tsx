import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--color-background1),var(--color-background2))] px-4 py-3 text-sm font-black text-white shadow-lg transition duration-150 hover:-translate-y-px hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
