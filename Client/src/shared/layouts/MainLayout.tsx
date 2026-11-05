import type { ReactNode } from 'react';
import { Icon, Header, NavItem } from '@ui';
import { navItems } from '@mocks/data';

interface MainLayoutProps {
  children: ReactNode;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  activeTasksCount: number;
  logoutSlot: ReactNode;
  profileSlot: ReactNode;
}

export function MainLayout({
  children,
  activeNav,
  setActiveNav,
  activeTasksCount,
  logoutSlot,
  profileSlot,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-text">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-background bg-white px-5 py-7 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="relative w-9 h-7">
            <span
              className="w-7 h-7 absolute top-2 left-2 rounded-md rotate-45"
              style={{
                background: 'linear-gradient(135deg, #b157e9, #7653da)',
              }}
            />
            <span
              className="w-7 h-7 absolute top-2 right-2 rounded-md rotate-45"
              style={{
                background: 'linear-gradient(135deg, #6d8bf0, #38b6e7)',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
          <span className="text-[22px] font-extrabold tracking-[-0.5px]">
            FamilyFlow
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map(item => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.label}
              onSelect={setActiveNav}
              badge={item.label === 'Мої справи' ? activeTasksCount : undefined}
            />
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-5 overflow-hidden rounded-[22px] bg-linear-to-br from-primarySoft to-gradientBlue p-4">
            <p className="mb-1 text-sm font-extrabold">Сімейна підказка</p>
            <p className="text-xs leading-5 text-lightText">
              Плануйте тиждень разом щонеділі — це займає лише 10 хвилин.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-extrabold text-primary">
              Дізнатись більше <Icon name="chevron" size={14} />
            </div>
          </div>
          <NavItem
            icon="settings"
            label="Налаштування"
            active={activeNav === 'Налаштування'}
            onSelect={setActiveNav}
          />
          {logoutSlot}
          <div className="mt-5 flex w-full items-center gap-3 border-t border-background px-2 pt-5">
            {profileSlot}
            <button
              aria-label="Меню профілю"
              className="ml-auto text-textMuted"
            >
              <Icon name="more" size={19} />
            </button>
          </div>
        </div>
      </aside>

      <main className="pb-24 lg:ml-[252px] lg:pb-8">
        <Header activeNav={activeNav} />

        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-8 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-[22px] border border-white/70 bg-white/90 p-2 shadow-[0_12px_40px_rgba(50,45,90,.16)] backdrop-blur-xl lg:hidden">
        {navItems.slice(0, 4).map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            mobileLabel={item.label === 'Мої справи' ? 'Справи' : undefined}
            active={activeNav === item.label}
            onSelect={setActiveNav}
            mobile
          />
        ))}
        <NavItem
          icon="users"
          label="Родина"
          active={activeNav === 'Родина'}
          onSelect={setActiveNav}
          mobile
        />
      </nav>
    </div>
  );
}
