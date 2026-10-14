import { useTaskStore } from '../store/task.store';

export function useTasksContext() {
  const state = useTaskStore();
  const visibleTasks = state.tasks.filter(task => {
    if (state.filter === 'Виконані') return task.done;
    if (state.filter === 'Активні') return !task.done;
    return true;
  });
  const completed = state.tasks.filter(task => task.done).length;
  const progress = state.tasks.length
    ? Math.round((completed / state.tasks.length) * 100)
    : 0;

  return {
    ...state,
    visibleTasks,
    completed,
    progress,
    addTask: () => void state.addTask(),
    toggleTask: (id: number) => void state.toggleTask(id),
  };
}
