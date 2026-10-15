import type { ReactNode } from 'react';

interface PageHeroProps {
  children: ReactNode;
  variant: 'family' | 'goals';
}

const baseClasses =
  'flex min-h-48 items-center justify-between gap-7 overflow-hidden rounded-3xl border border-white/70 px-8 py-8 shadow-[0_12px_34px_var(--color-page-shadow-welcome)] max-sm:min-h-0 max-sm:flex-col max-sm:items-start max-sm:px-5 max-sm:py-6';

const backgrounds = {
  family:
    'bg-[radial-gradient(circle_at_80%_20%,var(--color-page-overlay-white),transparent_32%),linear-gradient(120deg,var(--color-page-gradient-blue),var(--color-page-gradient-lavender)_55%,var(--color-page-gradient-mint))]',
  goals:
    'bg-[radial-gradient(circle_at_85%_15%,var(--color-page-overlay-white),transparent_32%),linear-gradient(120deg,var(--color-page-gradient-lavender),var(--color-page-gradient-blue)_58%,var(--color-page-gradient-mint))]',
};

export function PageHero({ children, variant }: PageHeroProps) {
  return (
    <section className={`${baseClasses} ${backgrounds[variant]}`}>
      {children}
    </section>
  );
}
