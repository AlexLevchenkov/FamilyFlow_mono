import { z } from 'zod';

export const createGoalFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Назва має містити щонайменше 2 символи')
      .max(150, 'Назва не повинна перевищувати 150 символів'),
    type: z.enum(['AMOUNT', 'COUNTER', 'STEPS'] as const, {
      message: 'Оберіть тип цілі',
    }),
    targetValue: z
      .number({ message: 'Вкажіть числове значення' })
      .positive('Ціль має бути більшою за 0'),
    currentValue: z
      .number({ message: 'Вкажіть числове значення' })
      .min(0, 'Поточне значення не може бути меншим за 0'),
    dueDate: z.string().min(1, 'Оберіть дедлайн для цілі'),
    currency: z.string().optional(),
    unit: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(data => data.currentValue <= data.targetValue, {
    message: 'Поточний прогрес не може перевищувати цільове значення',
    path: ['currentValue'],
  });

export type CreateGoalFormData = z.infer<typeof createGoalFormSchema>;
