import type { HTMLAttributes, ReactNode } from 'react';

interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article';
  children: ReactNode;
  className?: string;
}

export function Panel({
  as: Component = 'div',
  children,
  className = '',
  ...rest
}: PanelProps) {
  return (
    <Component
      className={`rounded-3xl border border-border bg-white p-6 shadow-[0_9px_28px_var(--color-shadowPanel)] max-sm:rounded-2xl max-sm:p-5 ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
