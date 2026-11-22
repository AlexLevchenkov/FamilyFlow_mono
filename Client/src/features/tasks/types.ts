import type { TaskModel, TaskType, Visibility } from '@types';

export const TASK_TYPE_CONFIG: Record<
  TaskType,
  { label: string; color: string }
> = {
  home: { label: 'Дім', color: '#ff708f' },
  family: { label: 'Родина', color: '#7b61ff' },
  work: { label: 'Робота', color: '#38bdf8' },
  health: { label: 'Здоров’я', color: '#10b981' },
  finance: { label: 'Фінанси', color: '#f59e0b' },
  learning: { label: 'Навчання', color: '#6366f1' },
  personal: { label: 'Особисте', color: '#ec4899' },
  social: { label: 'Спілкування', color: '#8b5cf6' },
  travel: { label: 'Подорожі', color: '#14b8a6' },
  other: { label: 'Інше', color: '#64748b' },
};

export interface Task {
  id: number;
  title: string;
  meta?: string;
  time?: string;
  category?: string;
  color?: string;
  done: boolean;
  type?: TaskType;
  visibility?: Visibility;
  rawTask?: TaskModel;
}

export function mapTaskModelToUiTask(task: TaskModel): Task {
  const config =
    TASK_TYPE_CONFIG[task.type] || { label: 'Справа', color: '#7955d6' };
  const d = new Date(task.date);
  const isToday =
    !isNaN(d.getTime()) && d.toDateString() === new Date().toDateString();
  const timeStr = !isNaN(d.getTime())
    ? isToday
      ? d.getHours() === 0 && d.getMinutes() === 0
        ? 'Сьогодні'
        : d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })
    : 'Сьогодні';

  return {
    id: task.id,
    title: task.title,
    meta: task.visibility === 'shared' ? 'Сімейна справа' : 'Особиста справа',
    time: timeStr,
    category: config.label,
    color: config.color,
    done: Boolean(task.status),
    type: task.type,
    visibility: task.visibility,
    rawTask: task,
  };
}
