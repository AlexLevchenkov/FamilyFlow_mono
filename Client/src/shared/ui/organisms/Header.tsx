import { useEffect, useState } from 'react';
import { useCurrentUserQuery, useFamilyQuery } from '@hooks';
import { Icon, IconButton } from '@ui';
import { formatDate } from '@utils';

interface HeaderProps {
  activeNav: string;
}

export function Header({ activeNav }: HeaderProps) {
  const { user } = useCurrentUserQuery();
  const { family } = useFamilyQuery();
  const name = user?.name || 'Велком';
  const [hasImageError, setHasImageError] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toLocaleUpperCase('uk-UA');

  useEffect(() => {
    setHasImageError(false);
  }, [user?.avatar]);

  const familyTitle = !!family
    ? `${family.members?.length} учасник${(
      family.members && family.members.length && family.members.length > 1)
      ? family.members.length > 4 ? 'ів' : 'а' : ''
    }`
    : 'Створіть сім\'ю';

  const pageTitle: Record<string, { eyebrow: string; title: string }> = {
    Огляд: {
      eyebrow: formatDate('weekdayDayMonth'),
      title: `Вітаємо, ${name}!`,
    },
    'Мої справи': { eyebrow: 'Ваш особистий простір', title: 'Мої справи' },
    Календар: { eyebrow: formatDate('monthYear'), title: 'Сімейний календар' },
    Цілі: { eyebrow: 'Рухайтесь разом', title: 'Сімейні цілі' },
    Родина: { eyebrow: familyTitle, title: 'Наша родина' },
  };

  return (
    <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-background bg-background/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-textMuted">
          {pageTitle[activeNav]?.eyebrow}
        </p>
        <h1 className="mt-1 text-[22px] font-extrabold tracking-tight md:text-[26px]">
          {pageTitle[activeNav]?.title}
        </h1>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="relative hidden md:block">
          <span className="absolute left-3 top-3 z-10 text-textMuted">
            <Icon name="search" size={18} />
          </span>
          <input
            aria-label="Пошук"
            className="h-10 w-52 rounded-xl border border-border bg-white py-0 pr-3.5 pl-10 text-base font-bold outline-none transition-all duration-150 focus:w-60 focus:border-primaryLight"
            placeholder="Знайти справу..."
          />
        </div>
        <IconButton aria-label="Сповіщення" className="relative">
          {' '}
          {/* TODO Add logic for notification bell  */}
          <Icon name="bell" size={20} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-danger" />
        </IconButton>
        <button className="hidden h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-extrabold shadow-sm sm:flex">
          {user?.avatar && !hasImageError ? (
            <img
              alt={name}
              className="size-8 shrink-0 rounded-full object-cover"
              src={user.avatar}
              onError={() => setHasImageError(true)}
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradientBlue text-[11px] text-info">
              {initials}
            </span>
          )}
          <Icon name="chevron" size={14} />
        </button>
      </div>
    </header>
  );
}
