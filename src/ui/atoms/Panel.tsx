import type { ReactNode } from "react"

interface PanelProps {
  as?: "div" | "section" | "article"
  children: ReactNode
  className?: string
}

export function Panel({ as: Component = "div", children, className = "" }: PanelProps) {
  return (
    <Component className={`rounded-3xl border border-page-border bg-white p-6 shadow-[0_9px_28px_var(--color-page-shadow-panel)] max-sm:rounded-2xl max-sm:p-5 ${className}`}>
      {children}
    </Component>
  )
}
