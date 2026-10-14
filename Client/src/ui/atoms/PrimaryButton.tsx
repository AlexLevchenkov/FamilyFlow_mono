import type { ButtonHTMLAttributes } from "react"

export function PrimaryButton({ className = "", children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex min-h-10 items-center gap-2 rounded-[13px] bg-linear-to-br from-background1 to-background2 px-4 py-3 text-md font-black text-white shadow-[0_8px_20px_rgba(107,72,204,0.2)] transition-all
        hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(107,72,204,0.28)] ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}