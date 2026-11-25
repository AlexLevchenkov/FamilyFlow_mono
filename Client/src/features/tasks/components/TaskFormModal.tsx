import { useState, type FormEvent } from 'react';
import { Modal, PrimaryButton } from '@ui';
import type { TaskModel, TaskType } from '@types';
import { TASK_TYPE_CONFIG } from '../types';

const taskTypes = Object.keys(TASK_TYPE_CONFIG) as TaskType[];

export interface TaskFormValues {
  title: string;
  type: TaskType;
  date: Date;
}

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
  onDelete: () => void;
  isPending: boolean;
  isDeleting: boolean;
  task?: TaskModel;
  initialTitle?: string;
}

function toLocalDateTimeValue(value: Date | string) {
  const date = new Date(value);
  const validDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const localDate = new Date(
    validDate.getTime() - validDate.getTimezoneOffset() * 60_000
  );

  return localDate.toISOString().slice(0, 16);
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  isPending,
  isDeleting,
  task,
  initialTitle = '',
}: TaskFormModalProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task?.title ?? initialTitle);
  const [type, setType] = useState<TaskType>(task?.type ?? 'personal');
  const [date, setDate] = useState(
    toLocalDateTimeValue(task?.date ?? new Date())
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedDate = new Date(date);
    if (!title.trim() || Number.isNaN(parsedDate.getTime())) return;

    onSubmit({
      title: title.trim(),
      type,
      date: parsedDate,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-black tracking-tight">
        {task ? 'Редагувати справу' : 'Нова справа'}
      </h2>
      <p className="mt-1 text-sm text-lightText">
        Вкажіть назву, тип і дату справи
      </p>

      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-1.5 block text-xs font-bold text-text"
            htmlFor="task-title"
          >
            Назва
          </label>
          <input
            autoFocus
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-text outline-none focus:border-primary focus:bg-white"
            id="task-title"
            maxLength={150}
            required
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-bold text-text"
            htmlFor="task-type"
          >
            Тип справи
          </label>
          <select
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-text outline-none focus:border-primary focus:bg-white"
            id="task-type"
            value={type}
            onChange={event => {
              const selectedType = taskTypes.find(
                taskType => taskType === event.target.value
              );
              if (selectedType) setType(selectedType);
            }}
          >
            {taskTypes.map(taskType => (
              <option key={taskType} value={taskType}>
                {TASK_TYPE_CONFIG[taskType].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="mb-1.5 block text-xs font-bold text-text"
            htmlFor="task-date"
          >
            Дата і час
          </label>
          <input
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-text outline-none focus:border-primary focus:bg-white"
            id="task-date"
            required
            type="datetime-local"
            value={date}
            onChange={event => setDate(event.target.value)}
          />
        </div>

        {task && isConfirmingDelete ? (
          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-danger/40 bg-dangerSoft p-3.5 text-xs sm:flex-row">
            <span className="font-extrabold text-danger">
              Ви дійсно хочете видалити цю справу?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                disabled={isDeleting}
                className="rounded-lg bg-white px-3 py-1.5 font-bold text-lightText shadow-xs hover:text-text"
              >
                Ні, залишити
              </button>
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="rounded-lg bg-danger px-3 py-1.5 font-bold text-white shadow-xs hover:opacity-95"
              >
                {isDeleting ? 'Видалення...' : 'Так, видалити'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between gap-3 pt-2">
            <div>
              {task && (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  disabled={isPending || isDeleting}
                  className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-danger transition-colors hover:bg-dangerSoft"
                >
                  Видалити справу
                </button>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-extrabold text-lightText hover:text-text"
                type="button"
                onClick={onClose}
                disabled={isPending || isDeleting}
              >
                Скасувати
              </button>
              <PrimaryButton
                disabled={isPending || isDeleting}
                type="submit"
              >
                {isPending
                  ? 'Збереження...'
                  : task
                    ? 'Зберегти зміни'
                    : 'Додати справу'}
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
