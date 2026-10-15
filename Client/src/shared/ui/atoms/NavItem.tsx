import { Icon } from './Icon';
import type { IconName } from '../../types/index';

export interface INavItem {
  icon: IconName;
  label: string;
  active: boolean;
  onSelect: (label: string) => void;
  badge?: number;
  mobile?: boolean;
  mobileLabel?: string;
}

const desktopClasses =
  'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-base font-extrabold text-page-copy transition-all duration-150 ease-in-out hover:bg-page-lavender hover:text-background2';
const activeDesktopClasses =
  'bg-[linear-gradient(90deg,var(--color-page-lavender-active),var(--color-page-lavender))] text-background2 shadow-[inset_3px_0_var(--color-page-accent-bright)]';
const mobileClasses =
  'flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-1.5 py-2 text-xs font-extrabold text-page-muted';
const activeMobileClasses = 'bg-page-lavender-active text-background2';

export const NavItem = ({
  icon,
  label,
  active,
  onSelect,
  badge,
  mobile = false,
  mobileLabel,
}: INavItem) => (
  <button
    aria-current={active ? 'page' : undefined}
    className={`${mobile ? mobileClasses : desktopClasses} ${
      active ? (mobile ? activeMobileClasses : activeDesktopClasses) : ''
    }`}
    onClick={() => onSelect(label)}
    type="button"
  >
    <Icon name={icon} size={mobile ? 20 : 21} />
    <span>{mobile ? (mobileLabel ?? label) : label}</span>
    {!mobile && badge != null && (
      <span className="ml-auto rounded-full bg-[#eee8ff] px-2 py-0.5 text-xs font-extrabold text-[#7955d6]">
        {badge}
      </span>
    )}
  </button>
);
