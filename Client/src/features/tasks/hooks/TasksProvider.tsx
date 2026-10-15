import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { initialTasks } from '@mocks/data';
import type { Task } from '../types';
import { TasksContext } from './TasksContext';

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState('Усі');
  const [showComposer, setShowComposer] = useState(false);
  const [newTask, setNewTask] = useState('');

  const visibleTasks = useMemo(() => {
    if (filter === 'Виконані') return tasks.filter(task => task.done);
    if (filter === 'Активні') return tasks.filter(task => !task.done);
    return tasks;
  }, [filter, tasks]);

  const completed = tasks.filter(task => task.done).length;
  const progress =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const toggleTask = useCallback((id: number) => {
    setTasks(current =>
      current.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }, []);

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;
    setTasks(current => [
      ...current,
      {
        id: Date.now(),
        title: newTask.trim(),
        meta: 'Особиста справа',
        time: 'Сьогодні',
        category: 'Нове',
        color: '#8b63de',
        done: false,
      },
    ]);
    setNewTask('');
    setShowComposer(false);
  }, [newTask]);

  const value = useMemo(
    () => ({
      tasks,
      setTasks,
      visibleTasks,
      completed,
      progress,
      filter,
      setFilter,
      showComposer,
      setShowComposer,
      newTask,
      setNewTask,
      addTask,
      toggleTask,
    }),
    [
      tasks,
      visibleTasks,
      completed,
      progress,
      filter,
      showComposer,
      newTask,
      addTask,
      toggleTask,
    ]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
