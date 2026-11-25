import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { CreateTaskBody, UpdateTaskBody } from '@types';
import type { Task } from '../types';

export interface TasksContextValue {
  tasks: Task[];
  setTasks?: Dispatch<SetStateAction<Task[]>>;
  visibleTasks: Task[];
  completed: number;
  progress: number;
  filter: string;
  setFilter: (filter: string) => void;
  showComposer: boolean;
  setShowComposer: (show: boolean) => void;
  newTask: string;
  setNewTask: (task: string) => void;
  addTask: (task: CreateTaskBody, onSuccess?: () => void) => void;
  editTask: (
    id: number,
    task: UpdateTaskBody,
    onSuccess?: () => void
  ) => void;
  toggleTask: (id: number) => void;
  deleteTask?: (id: number, onSuccess?: () => void) => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

export const TasksContext = createContext<TasksContextValue | null>(null);
