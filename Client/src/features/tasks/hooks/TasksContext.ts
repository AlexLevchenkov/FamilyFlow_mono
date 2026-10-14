import { createContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Task } from '../types';

export interface TasksContextValue {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  visibleTasks: Task[];
  completed: number;
  progress: number;
  filter: string;
  setFilter: (filter: string) => void;
  showComposer: boolean;
  setShowComposer: (show: boolean) => void;
  newTask: string;
  setNewTask: (task: string) => void;
  addTask: () => void;
  toggleTask: (id: number) => void;
}

export const TasksContext = createContext<TasksContextValue | null>(null);
