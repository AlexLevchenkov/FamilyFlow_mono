import type { IconName, TaskModel } from '@types';

export const initialTasks: TaskModel[] = [
  {
    id: 1,
    userId: 1,
    title: 'Купити продукти на вечерю',
    type: 'personal',
    visibility: 'personal',
    status: true,
    date: new Date(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(),
  },
  {
    id: 2,
    userId: 1,
    title: 'Забрати Марка зі школи!',
    type: 'family',
    visibility: 'shared',
    status: true,
    date: new Date(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(),
  },
  {
    id: 3,
    userId: 1,
    title: 'Запис до сімейного лікаря',
    type: 'health',
    visibility: 'shared',
    status: true,
    date: new Date(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(),
  },
  {
    id: 4,
    userId: 1,
    title: 'Спланувати вихідні',
    type: 'social',
    visibility: 'shared',
    status: true,
    date: new Date(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(),
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
