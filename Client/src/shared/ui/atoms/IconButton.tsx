import type { ButtonHTMLAttributes } from 'react';

export function IconButton({
  className = '',
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`grid size-10 place-items-center rounded-xl border border-page-border bg-white text-page-copy transition-all duration-150 hover:-translate-y-px hover:text-selected hover:shadow-[0_5px_15px_var(--color-page-shadow-soft)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
