import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useTasksQuery } from '@hooks';
import type { Task } from '../types';
import { mapTaskModelToUiTask } from '../types';
import { TasksContext } from './TasksContext';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from './useTaskMutations';

export function TasksProvider({ children }: { children: ReactNode }) {
  const { tasks: backendTasks = [], isLoading } = useTasksQuery({ limit: 100 });
  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();

  const [filter, setFilter] = useState('Всі');
  const [showComposer, setShowComposer] = useState(false);
  const [newTask, setNewTask] = useState('');

  const tasks: Task[] = useMemo(() => {
    return (backendTasks || []).map(mapTaskModelToUiTask);
  }, [backendTasks]);

  const visibleTasks = useMemo(() => {
    if (filter === 'Виконані') return tasks.filter(task => task.done);
    if (filter === 'Активні') return tasks.filter(task => !task.done);
    return tasks;
  }, [filter, tasks]);

  const completed = useMemo(
    () => tasks.filter(task => task.done).length,
    [tasks]
  );

  const progress = useMemo(
    () => (tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0),
    [tasks.length, completed]
  );

  const toggleTask = useCallback(
    (id: number) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const raw = task.rawTask;
      updateTaskMutation.mutate({
        id,
        dto: {
          title: raw?.title || task.title,
          type: raw?.type || task.type || 'home',
          visibility: raw?.visibility || task.visibility || 'shared',
          status: !task.done,
          date: raw?.date ? new Date(raw.date) : new Date(),
        },
      });
    },
    [tasks, updateTaskMutation]
  );

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;

    createTaskMutation.mutate(
      {
        title: newTask.trim(),
        type: 'personal',
        visibility: 'shared',
        date: new Date(),
      },
      {
        onSuccess: () => {
          setNewTask('');
          setShowComposer(false);
        },
      }
    );
  }, [newTask, createTaskMutation]);

  const deleteTask = useCallback(
    (id: number) => {
      deleteTaskMutation.mutate(id);
    },
    [deleteTaskMutation]
  );

  const value = useMemo(
    () => ({
      tasks,
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
      deleteTask,
      isLoading,
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
      deleteTask,
      isLoading,
    ]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}
