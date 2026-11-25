import { useCallback, useMemo, useState } from 'react';
import { useTasksQuery } from '@hooks';
import type {
  CreateTaskBody,
  GetUserTasksParams,
  UpdateTaskBody,
} from '@types';
import type { Task } from '../types';
import { mapTaskModelToUiTask } from '../types';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from './useTaskMutations';

export function useTasksManager(params?: GetUserTasksParams) {
  const {
    tasks: backendTasks = [],
    isLoading,
    isError,
    error,
    pagination,
    refetch,
  } = useTasksQuery(params);

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

  const activeCount = useMemo(
    () => tasks.filter(task => !task.done).length,
    [tasks]
  );

  const progress = useMemo(
    () => (tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0),
    [tasks.length, completed]
  );

  const todayTasksCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return tasks.filter(t => {
      const d = t.rawTask?.date ? new Date(t.rawTask.date) : new Date();
      return !isNaN(d.getTime()) && d.toDateString() === todayStr;
    }).length;
  }, [tasks]);

  const todayActiveTasksCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return tasks.filter(t => {
      if (t.done) return false;
      const d = t.rawTask?.date ? new Date(t.rawTask.date) : new Date();
      return !isNaN(d.getTime()) && d.toDateString() === todayStr;
    }).length;
  }, [tasks]);

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

  const addTask = useCallback(
    (task: CreateTaskBody, onSuccess?: () => void) => {
      createTaskMutation.mutate(task, {
        onSuccess: () => {
          setNewTask('');
          setShowComposer(false);
          onSuccess?.();
        },
      });
    },
    [createTaskMutation]
  );

  const editTask = useCallback(
    (id: number, task: UpdateTaskBody, onSuccess?: () => void) => {
      updateTaskMutation.mutate(
        { id, dto: task },
        { onSuccess }
      );
    },
    [updateTaskMutation]
  );

  const deleteTask = useCallback(
    (id: number, onSuccess?: () => void) => {
      deleteTaskMutation.mutate(id, { onSuccess });
    },
    [deleteTaskMutation]
  );

  return {
    tasks,
    visibleTasks,
    completed,
    activeCount,
    todayTasksCount,
    todayActiveTasksCount,
    progress,
    filter,
    setFilter,
    showComposer,
    setShowComposer,
    newTask,
    setNewTask,
    addTask,
    editTask,
    toggleTask,
    deleteTask,
    isLoading,
    isError,
    error,
    pagination,
    refetch,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isSavingTask: createTaskMutation.isPending || updateTaskMutation.isPending,
  };
}
