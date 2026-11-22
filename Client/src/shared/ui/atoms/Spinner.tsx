import type { ReactNode } from 'react';

export interface SpinnerProps {
  /**
   * If true, renders the spinner animation.
   * If omitted or undefined, the component renders the spinner directly.
   */
  isLoading?: boolean;
  /**
   * If true (and not loading), renders the emptyPlaceholder instead of children.
   */
  isEmpty?: boolean;
  /**
   * Placeholder to render when isEmpty is true.
   */
  emptyPlaceholder?: ReactNode;
  /**
   * Content to render when not loading and not empty.
   */
  children?: ReactNode;
  /**
   * Size of the spinner. Defaults to 'md'.
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Additional container class name.
   */
  className?: string;
  /**
   * Optional loading label.
   */
  label?: string;
}

const sizeClasses = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

export function Spinner({
  isLoading,
  isEmpty = false,
  emptyPlaceholder = null,
  children = null,
  size = 'md',
  className = '',
  label = 'Завантаження...',
}: SpinnerProps) {
  // If isLoading is explicitly passed and false
  if (isLoading === false) {
    if (isEmpty) {
      return <>{emptyPlaceholder}</>;
    }
    return <>{children}</>;
  }

  // Standalone spinner or isLoading is true
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`}
      />
      {label && (
        <p className="text-xs font-bold uppercase tracking-wider text-textMuted">
          {label}
        </p>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}

