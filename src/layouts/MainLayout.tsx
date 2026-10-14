import type { ReactNode } from "react"
import { Icon } from "../ui/atoms/Icon"
import { IconButton } from "../ui/atoms/IconButton"
import { NavItem } from "../ui/atoms/NavItem"
import { User } from "../ui/atoms/User"
import { navItems, pageCopy } from "../mocks/data"
import { LogoutButton } from "../ui/molecules/LogoutButton"
import type { Task } from "../types/index"

interface MainLayoutProps {
  children: ReactNode
  activeNav: string
  setActiveNav: (nav: string) => void
  tasks: Task[]
}

export function MainLayout({ children, activeNav, setActiveNav, tasks }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f5f5fb] text-[#24244c]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[252px] flex-col border-r border-[#ecebf5] bg-white px-5 py-7 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="relative w-9 h-7">
            <span className="w-7 h-7 absolute top-2 left-2 rounded-md rotate-45" style={{
              background: "linear-gradient(135deg, #b157e9, #7653da)",
            }} />
            <span className="w-7 h-7 absolute top-2 right-2 rounded-md rotate-45" style={{
              background: "linear-gradient(135deg, #6d8bf0, #38b6e7)",
              mixBlendMode: "multiply",
            }} />
          </div>
          <span className="text-[22px] font-extrabold tracking-[-0.5px]">
            FamilyFlow
          </span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.label}
              onSelect={setActiveNav}
              badge={item.label === "Мої справи" ? tasks.filter((task) => !task.done).length : undefined}
            />
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-5 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f2ecff] to-[#e8f1ff] p-4">
            <p className="mb-1 text-sm font-extrabold">Сімейна підказка</p>
            <p className="text-xs leading-5 text-[#77778f]">
              Плануйте тиждень разом щонеділі — це займає лише 10 хвилин.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-extrabold text-[#7452d2]">
              Дізнатись більше <Icon name="chevron" size={14} />
            </div>
          </div>
          <NavItem
            icon="settings"
            label="Налаштування"
            active={activeNav === "Налаштування"}
            onSelect={setActiveNav}
          />
          <LogoutButton />
          <div className="mt-5 flex w-full items-center gap-3 border-t border-[#f0eff6] px-2 pt-5">
            <User />
            <button
              aria-label="Меню профілю"
              className="ml-auto text-[#9b99ad]"
            >
              <Icon name="more" size={19} />
            </button>
          </div>
        </div>
      </aside>

      <main className="pb-24 lg:ml-[252px] lg:pb-8">
        <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-[#efedf6] bg-[#f5f5fb]/90 px-5 backdrop-blur-xl md:px-8 lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9997ad]">
              {pageCopy[activeNav]?.eyebrow}
            </p>
            <h1 className="mt-1 text-[22px] font-extrabold tracking-tight md:text-[26px]">
              {pageCopy[activeNav]?.title}
            </h1>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative hidden md:block">
              <span className="absolute left-3 top-3 z-10 text-page-muted">
                <Icon name="search" size={18} />
              </span>
              <input
                aria-label="Пошук"
                className="h-10 w-52 rounded-xl border border-page-border bg-white py-0 pr-3.5 pl-10 text-base font-bold outline-none transition-all duration-150 focus:w-60 focus:border-[#b6a3e9]"
                placeholder="Знайти справу..."
              />
            </div>
            <IconButton aria-label="Сповіщення" className="relative">
              <Icon name="bell" size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-[#f26f87]" />
            </IconButton>
            <button className="hidden h-10 items-center gap-2 rounded-full bg-white px-3 text-sm font-extrabold shadow-sm sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#dfe6ff] text-[11px] text-[#5267ca]">
                ОК
              </span>
              <Icon name="chevron" size={14} />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-8 lg:px-10 lg:py-8">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-[22px] border border-white/70 bg-white/90 p-2 shadow-[0_12px_40px_rgba(50,45,90,.16)] backdrop-blur-xl lg:hidden">
        {navItems.slice(0, 4).map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            mobileLabel={item.label === "Мої справи" ? "Справи" : undefined}
            active={activeNav === item.label}
            onSelect={setActiveNav}
            mobile
          />
        ))}
        <NavItem
          icon="users"
          label="Родина"
          active={activeNav === "Родина"}
          onSelect={setActiveNav}
          mobile
        />
      </nav>
    </div>
  )
}
