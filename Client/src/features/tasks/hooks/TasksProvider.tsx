import type { ReactNode } from 'react';
import { useTasksManager } from './useTasksManager';
import { TasksContext } from './TasksContext';

export function TasksProvider({ children }: { children: ReactNode }) {
  const manager = useTasksManager({ limit: 100 });

  return (
    <TasksContext.Provider value={manager}>{children}</TasksContext.Provider>
  );
}
