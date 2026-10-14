import { useEffect, type ReactNode } from 'react';
import { useTaskStore } from '../store/task.store';

export function TasksProvider({ children }: { children: ReactNode }) {
  const loadTasks = useTaskStore(state => state.loadTasks);
  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);
  return children;
}
