import type { IconName } from '@types';
import type { Task } from '@features/tasks/types';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Купити продукти на вечерю',
    meta: 'Сімейні справи',
    time: '10:00',
    category: 'Дім',
    color: '#35b69f',
    done: true,
  },
  {
    id: 2,
    title: 'Забрати Марка зі школи!',
    meta: 'Відповідає Олексій',
    time: '14:30',
    category: 'Діти',
    color: '#ec6f91',
    done: false,
  },
  {
    id: 3,
    title: 'Запис до сімейного лікаря',
    meta: 'Для всієї родини',
    time: '16:00',
    category: "Здоров'я",
    color: '#6684df',
    done: false,
  },
  {
    id: 4,
    title: 'Спланувати вихідні',
    meta: 'Обговорити разом',
    time: '19:00',
    category: "Сім'я",
    color: '#f3a541',
    done: false,
  },
];

export const navItems: { label: string; icon: IconName }[] = [
  { label: 'Огляд', icon: 'home' },
  { label: 'Мої справи', icon: 'tasks' },
  { label: 'Календар', icon: 'calendar' },
  { label: 'Цілі', icon: 'target' },
  { label: 'Родина', icon: 'users' },
];

export const family = [
  { name: 'Олексій', initials: 'О', color: '#5267ca', tasks: 3 },
  { name: 'Анна', initials: 'А', color: '#e76f91', tasks: 2 },
  { name: 'Марк', initials: 'М', color: '#f2a13b', tasks: 1 },
  { name: 'Софія', initials: 'С', color: '#4cb89e', tasks: 2 },
];

export const events = [
  {
    day: 28,
    month: 'БЕР',
    title: 'Батьківські збори',
    time: '18:30',
    color: '#6d7ee8',
  },
  {
    day: 30,
    month: 'БЕР',
    title: 'Сімейний пікнік',
    time: '12:00',
    color: '#e87891',
  },
  {
    day: 2,
    month: 'КВІ',
    title: 'День народження Софії',
    time: '17:00',
    color: '#39b29d',
  },
];

export const goals = [
  {
    title: 'Сімейна подорож у Карпати',
    category: 'Подорожі',
    progress: 68,
    detail: 'Зібрано 20 400 із 30 000 ₴',
    color: '#7656d0',
  },
  {
    title: '12 сімейних вечорів',
    category: 'Час разом',
    progress: 42,
    detail: '5 із 12 вечорів проведено',
    color: '#e87891',
  },
  {
    title: 'Облаштувати дитячу',
    category: 'Дім',
    progress: 80,
    detail: '4 із 5 кроків виконано',
    color: '#39b29d',
  },
];

export const pageCopy: Record<string, { eyebrow: string; title: string }> = {
  Огляд: { eyebrow: 'Середа, 26 березня', title: 'Вітаємо, Олексію!' },
  'Мої справи': { eyebrow: 'Ваш особистий простір', title: 'Мої справи' },
  Календар: { eyebrow: 'Березень 2026', title: 'Сімейний календар' },
  Цілі: { eyebrow: 'Рухайтесь разом', title: 'Сімейні цілі' },
  Родина: { eyebrow: '4 учасники', title: 'Наша родина' },
};
