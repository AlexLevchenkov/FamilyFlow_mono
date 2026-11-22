import { TaskListPanel } from '@features/tasks';
import type { Task } from '@features/tasks';

interface HomeTasksSectionProps {
  tasks: Task[];
  visibleTasks: Task[];
  completed: number;
  filter: string;
  setFilter: (filter: string) => void;
  showComposer: boolean;
  setShowComposer: (show: boolean) => void;
  newTask: string;
  setNewTask: (task: string) => void;
  addTask: () => void;
  toggleTask: (id: number) => void;
  groupByDay?: boolean;
}

export function HomeTasksSection({
  tasks,
  visibleTasks,
  completed,
  filter,
  setFilter,
  showComposer,
  setShowComposer,
  newTask,
  setNewTask,
  addTask,
  toggleTask,
  groupByDay = true,
}: HomeTasksSectionProps) {
  return (
    <TaskListPanel
      title="Справи на тиждень"
      description={`${completed} з ${tasks.length} вже виконано`}
      visibleTasks={visibleTasks}
      filter={filter}
      setFilter={setFilter}
      showComposer={showComposer}
      setShowComposer={setShowComposer}
      newTask={newTask}
      setNewTask={setNewTask}
      addTask={addTask}
      toggleTask={toggleTask}
      showFooterAdd
      groupByDay={groupByDay}
    />
  );
}
