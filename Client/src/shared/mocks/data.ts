import type { IconName } from '@types';

export const navItems: { label: string; icon: IconName }[] = [
  { label: 'Огляд', icon: 'home' },
  { label: 'Мої справи', icon: 'tasks' },
  { label: 'Календар', icon: 'calendar' },
  { label: 'Цілі', icon: 'target' },
  { label: 'Родина', icon: 'users' },
];

export const pageCopy: Record<string, { eyebrow: string; title: string }> = {
  Огляд: { eyebrow: 'Середа, 26 березня', title: 'Вітаємо, Олексію!' },
  'Мої справи': { eyebrow: 'Ваш особистий простір', title: 'Мої справи' },
  Календар: { eyebrow: 'Березень 2026', title: 'Сімейний календар' },
  Цілі: { eyebrow: 'Рухайтесь разом', title: 'Сімейні цілі' },
  Родина: { eyebrow: '4 учасники', title: 'Наша родина' },
};
