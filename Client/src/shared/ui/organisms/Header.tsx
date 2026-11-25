import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@features/auth';
import { getApiErrorMessage } from '@api';
import { useCurrentUserQuery, useFamilyQuery } from '@hooks';
import { HeaderSearch } from '@features/search';
import { Icon, toast } from '@ui';
import { formatDate } from '@utils';

interface HeaderProps {
  activeNav: string;
}

export function Header({ activeNav }: HeaderProps) {
  const { user } = useCurrentUserQuery();
  const { family } = useFamilyQuery();
  const navigate = useNavigate();
  const logout = useLogout();
  const name = user?.name || 'Велком';
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);
  const hasImageError = user?.avatar === failedAvatar;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toLocaleUpperCase('uk-UA');

  useEffect(() => {
    if (!isProfileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !profileMenuRef.current?.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileMenuOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setIsProfileMenuOpen(false);
        navigate('/login');
      },
      onError: error => {
        toast.error(getApiErrorMessage(error, 'Не вдалося вийти з акаунта'));
      },
    });
  };

  const familyTitle = family
    ? `${family.members?.length} учасник${
        family.members && family.members.length && family.members.length > 1
          ? family.members.length > 4
            ? 'ів'
            : 'а'
          : ''
      }`
    : "Створіть сім'ю";

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
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-background bg-background/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-textMuted">
          {pageTitle[activeNav]?.eyebrow}
        </p>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight md:text-3xl">
          {pageTitle[activeNav]?.title}
        </h1>
      </div>
      <div className="flex items-center gap-2.5">
        <HeaderSearch />
        <div ref={profileMenuRef} className="relative hidden sm:block">
          <button
            type="button"
            aria-label="Меню профілю"
            aria-controls="header-profile-menu"
            aria-expanded={isProfileMenuOpen}
            aria-haspopup="menu"
            className="flex h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-extrabold shadow-sm"
            onClick={() => setIsProfileMenuOpen(open => !open)}
          >
            {user?.avatar && !hasImageError ? (
              <img
                alt=""
                className="size-8 shrink-0 rounded-full object-cover"
                src={user.avatar}
                onError={() => setFailedAvatar(user.avatar)}
              />
            ) : (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradientBlue text-[11px] text-info">
                {initials}
              </span>
            )}
            <span>{name}</span>
            <Icon name="chevron" size={14} />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-border bg-white p-2 shadow-xl">
              <div className="flex items-center gap-3 px-3 py-2">
                {user?.avatar && !hasImageError ? (
                  <img
                    alt=""
                    className="size-10 shrink-0 rounded-full object-cover"
                    src={user.avatar}
                    onError={() => setFailedAvatar(user.avatar)}
                  />
                ) : (
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradientBlue text-sm font-extrabold text-info">
                    {initials}
                  </span>
                )}
                <span className="min-w-0 truncate text-sm font-extrabold text-text">
                  {name}
                </span>
              </div>
              <div className="my-2 border-t border-border" />
              <div
                id="header-profile-menu"
                role="menu"
                aria-label="Дії профілю"
                className="space-y-1"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-lightText transition-colors hover:bg-background hover:text-background2"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigate('/settings');
                  }}
                >
                  <Icon name="settings" size={19} />
                  <span>Налаштування</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold text-lightText transition-colors hover:bg-background hover:text-background2"
                  disabled={logout.isPending}
                  onClick={handleLogout}
                >
                  <Icon name="arrow" size={19} />
                  <span>{logout.isPending ? 'Вихід...' : 'Вийти'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
