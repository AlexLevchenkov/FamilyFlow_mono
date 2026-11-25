import { TaskListPanel } from '@features/tasks';
import type { Task } from '@features/tasks';
import type { CreateTaskBody, UpdateTaskBody } from '@types';

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
  addTask: (task: CreateTaskBody, onSuccess?: () => void) => void;
  editTask: (
    id: number,
    task: UpdateTaskBody,
    onSuccess?: () => void
  ) => void;
  deleteTask: (id: number, onSuccess?: () => void) => void;
  toggleTask: (id: number) => void;
  isSavingTask: boolean;
  isDeleting: boolean;
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
  editTask,
  deleteTask,
  toggleTask,
  isSavingTask,
  isDeleting,
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
      editTask={editTask}
      deleteTask={deleteTask}
      toggleTask={toggleTask}
      isSavingTask={isSavingTask}
      isDeleting={isDeleting}
      showFooterAdd
      groupByDay={groupByDay}
    />
  );
}
