import { useMemo, useState } from 'react';
import { Icon, Panel, PrimaryButton } from '@ui';
import { TaskRow } from './TaskRow';
import { TaskFormModal } from './TaskFormModal';
import type { TaskFormValues } from './TaskFormModal';
import type { Task } from '../types';
import type { CreateTaskBody, TaskModel, UpdateTaskBody } from '@types';

interface TaskListPanelProps {
  title: string;
  description: string;
  visibleTasks: Task[];
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
  showHeaderAdd?: boolean;
  showFooterAdd?: boolean;
  groupByDay?: boolean;
}

const filters = ['Всі', 'Активні', 'Виконані'];

function pluralizeTasks(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'справ';
  if (mod10 === 1) return 'справа';
  if (mod10 >= 2 && mod10 <= 4) return 'справи';
  return 'справ';
}

interface DayGroup {
  key: string;
  timestamp: number;
  label: string;
  dateLabel: string;
  isToday: boolean;
  tasks: Task[];
}

function getDayGroups(tasks: Task[]): DayGroup[] {
  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const groupsMap = new Map<string, DayGroup>();

  for (const task of tasks) {
    const rawDate = task.rawTask?.date;
    const d = rawDate ? new Date(rawDate) : new Date();
    const validDate = !isNaN(d.getTime()) ? d : new Date();
    const key = `${validDate.getFullYear()}-${String(validDate.getMonth() + 1).padStart(2, '0')}-${String(validDate.getDate()).padStart(2, '0')}`;

    if (!groupsMap.has(key)) {
      const isToday = key === todayKey;
      const isTomorrow = key === tomorrowKey;

      let label = isToday
        ? 'Сьогодні'
        : isTomorrow
          ? 'Завтра'
          : validDate.toLocaleDateString('uk-UA', { weekday: 'long' });
      label = label.charAt(0).toUpperCase() + label.slice(1);

      const dateLabel = validDate.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'short',
      });

      const dayStart = new Date(
        validDate.getFullYear(),
        validDate.getMonth(),
        validDate.getDate()
      ).getTime();

      groupsMap.set(key, {
        key,
        timestamp: dayStart,
        label,
        dateLabel,
        isToday,
        tasks: [],
      });
    }

    groupsMap.get(key)!.tasks.push(task);
  }

  return Array.from(groupsMap.values()).sort(
    (a, b) => a.timestamp - b.timestamp
  );
}

export function TaskListPanel({
  title,
  description,
  visibleTasks,
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
  showHeaderAdd = false,
  showFooterAdd = false,
  groupByDay = false,
}: TaskListPanelProps) {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskModel>();

  const dayGroups = useMemo(() => {
    if (!groupByDay) return [];
    return getDayGroups(visibleTasks);
  }, [groupByDay, visibleTasks]);

  function openCreateTaskForm() {
    if (!newTask.trim()) return;
    setTaskToEdit(undefined);
    setIsTaskFormOpen(true);
  }

  function openEditTaskForm(task: Task) {
    if (!task.rawTask) return;
    setTaskToEdit(task.rawTask);
    setIsTaskFormOpen(true);
  }

  function closeTaskForm() {
    setIsTaskFormOpen(false);
    setTaskToEdit(undefined);
  }

  function saveTask(values: TaskFormValues) {
    if (taskToEdit) {
      editTask(
        taskToEdit.id,
        {
          title: values.title,
          type: values.type,
          visibility: taskToEdit.visibility,
          status: taskToEdit.status,
          date: values.date,
        },
        closeTaskForm
      );
      return;
    }

    addTask(
      {
        title: values.title,
        type: values.type,
        visibility: 'shared',
        date: values.date,
      },
      closeTaskForm
    );
  }

  return (
    <Panel as="section">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[19px] font-black tracking-[-0.25px]">{title}</h2>
          <p className="mt-1 text-sm text-lightText">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-background p-1">
            {filters.map(item => (
              <button
                className={`rounded-[9px] px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                  filter === item
                    ? 'bg-white text-primary shadow-[0_2px_8px_rgba(54,48,88,0.09)]'
                    : 'text-lightText hover:text-text'
                }`}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {showHeaderAdd && (
            <PrimaryButton onClick={() => setShowComposer(true)}>
              <Icon name="plus" size={17} /> Додати
            </PrimaryButton>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {visibleTasks.length === 0 ? (
          <p className="py-6 text-center text-sm font-semibold text-textPlaceholder">
            {filter === 'Виконані'
              ? 'Поки що немає виконаних справ'
              : filter === 'Активні'
                ? 'Усі справи виконано!'
                : 'Список справ порожній'}
          </p>
        ) : groupByDay ? (
          dayGroups.map(group => (
            <div key={group.key} className="space-y-2">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5 pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-lg px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                      group.isToday
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-background text-textMuted'
                    }`}
                  >
                    {group.label}
                  </span>
                  <span className="text-xs font-bold text-textPlaceholder">
                    {group.dateLabel}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-textPlaceholder">
                  {group.tasks.length} {pluralizeTasks(group.tasks.length)}
                </span>
              </div>
              <div className="space-y-2.5">
                {group.tasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    toggleTask={toggleTask}
                    onEdit={openEditTaskForm}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-2.5">
            {visibleTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                toggleTask={toggleTask}
                onEdit={openEditTaskForm}
              />
            ))}
          </div>
        )}
      </div>

      {showComposer && (
        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-primarySoft bg-panelsColor p-3 sm:flex-row">
          <input
            autoFocus
            className="min-w-0 flex-1 rounded-xl border border-primarySoft bg-white px-4 py-2.5 text-sm font-bold outline-none focus:border-primary"
            onChange={event => setNewTask(event.target.value)}
            onKeyDown={event => event.key === 'Enter' && openCreateTaskForm()}
            placeholder="Напишіть нову справу..."
            value={newTask}
          />
          <PrimaryButton
            className="justify-center"
            disabled={!newTask.trim()}
            onClick={openCreateTaskForm}
          >
            Додати
          </PrimaryButton>
          <button
            className="cursor-pointer px-3 text-sm font-extrabold text-lightText hover:text-text"
            onClick={() => setShowComposer(false)}
          >
            Скасувати
          </button>
        </div>
      )}

      {showFooterAdd && !showComposer && (
        <button
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border border-dashed border-primaryMuted p-3 text-xs font-black
          text-primary transition-all hover:border-primaryMuted hover:bg-primarySoft"
          onClick={() => setShowComposer(true)}
        >
          <Icon name="plus" size={18} /> Додати нову справу
        </button>
      )}

      {isTaskFormOpen && (
        <TaskFormModal
          initialTitle={newTask}
          isOpen={isTaskFormOpen}
          isDeleting={isDeleting}
          isPending={isSavingTask}
          task={taskToEdit}
          onClose={closeTaskForm}
          onDelete={() => {
            if (taskToEdit) deleteTask(taskToEdit.id, closeTaskForm);
          }}
          onSubmit={saveTask}
        />
      )}
    </Panel>
  );
}
