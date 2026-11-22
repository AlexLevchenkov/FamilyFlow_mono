import { z } from 'zod';
import type { Repeatability } from '@types';

export const REPEATABILITY_OPTIONS: Array<{
  value: Repeatability;
  label: string;
}> = [
  { value: 'none', label: 'Не повторювати' },
  { value: 'day', label: 'Щодня' },
  { value: 'working', label: 'У робочі дні' },
  { value: 'week', label: 'Щотижня' },
  { value: 'month', label: 'Щомісяця' },
  { value: 'quarter', label: 'Щокварталу' },
  { value: 'year', label: 'Щороку' },
];

export const EVENT_COLORS = [
  { value: '#7955d6', label: 'Фіолетовий' },
  { value: '#36a98d', label: 'М’ятний' },
  { value: '#e76f91', label: 'Рожевий' },
  { value: '#f2a13b', label: 'Бурштиновий' },
  { value: '#538fc5', label: 'Блакитний' },
  { value: '#9a7cde', label: 'Лавандовий' },
];

export const createEventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Назва має містити щонайменше 2 символи')
    .max(150, 'Назва не повинна перевищувати 150 символів'),
  date: z.string().min(1, 'Оберіть дату'),
  time: z.string().optional(),
  color: z.string().min(1, 'Оберіть колір'),
  repeatability: z.enum(
    ['none', 'day', 'working', 'week', 'month', 'quarter', 'year'] as const,
    {
      message: 'Оберіть повторюваність',
    }
  ),
  isPersonal: z.boolean(),
});

export type CreateEventFormData = z.infer<typeof createEventFormSchema>;
