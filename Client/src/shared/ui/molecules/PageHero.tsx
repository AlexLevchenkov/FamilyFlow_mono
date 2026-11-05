import type { ReactNode } from 'react';

interface PageHeroProps {
  children: ReactNode;
  variant: 'family' | 'goals';
}

const baseClasses =
  'flex min-h-48 items-center justify-between gap-7 overflow-hidden rounded-3xl border border-white/70 px-8 py-8 shadow-[0_12px_34px_var(--color-shadowSoft)] max-sm:min-h-0 max-sm:flex-col max-sm:items-start max-sm:px-5 max-sm:py-6';

const backgrounds = {
  family:
    'bg-[radial-gradient(circle_at_80%_20%,var(--color-overlayWhite),transparent_32%),linear-gradient(120deg,var(--color-gradientBlue),var(--color-gradientLavender)_55%,var(--color-gradientMint))]',
  goals:
    'bg-[radial-gradient(circle_at_85%_15%,var(--color-overlayWhite),transparent_32%),linear-gradient(120deg,var(--color-gradientLavender),var(--color-gradientBlue)_58%,var(--color-gradientMint))]',
};

export function PageHero({ children, variant }: PageHeroProps) {
  return (
    <section className={`${baseClasses} ${backgrounds[variant]}`}>
      {children}
    </section>
  );
}
