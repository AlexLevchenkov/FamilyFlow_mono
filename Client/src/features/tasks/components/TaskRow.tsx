import { Icon } from '@ui';
import type { Task } from '../types';

interface TaskRowProps {
  task: Task;
  toggleTask: (id: number) => void;
}

export function TaskRow({ task, toggleTask }: TaskRowProps) {
  const isDone = Boolean(task.done);

  return (
    <article
      className={`group flex items-center gap-3.5 rounded-2xl border px-3.5 py-2.5 transition-all duration-200 sm:px-4 sm:py-3 ${
        isDone
          ? 'border-border/60 bg-panelsColor/60 opacity-75 hover:opacity-100 hover:border-border'
          : 'border-border bg-white shadow-2xs hover:-translate-y-0.5 hover:border-borderHover hover:shadow-sm'
      }`}
    >
      <button
        type="button"
        aria-label={isDone ? 'Позначити як невиконану' : 'Позначити як виконану'}
        onClick={e => {
          e.stopPropagation();
          if (task.id !== undefined) toggleTask(task.id);
        }}
        className={`relative grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-all duration-200 cursor-pointer ${
          isDone
            ? 'border-success bg-success text-white shadow-xs scale-105'
            : 'border-borderStrong bg-white text-transparent hover:border-primary hover:bg-primarySoft/30'
        }`}
      >
        <Icon
          name="check"
          size={13}
          className={`transition-transform duration-200 ${
            isDone ? 'scale-100' : 'scale-0'
          }`}
        />
      </button>

      <div
        className="min-w-0 flex-1 cursor-pointer select-none"
        onClick={() => {
          if (task.id !== undefined) toggleTask(task.id);
        }}
      >
        <p
          className={`truncate text-sm font-extrabold sm:text-base transition-all duration-200 ${
            isDone
              ? 'text-textPlaceholder line-through font-semibold'
              : 'text-text group-hover:text-primary'
          }`}
        >
          {task.title}
        </p>
        <p className="mt-0.5 text-xs font-semibold text-textMuted">
          {task.meta}
        </p>
      </div>

      {task.category && (
        <span
          className={`hidden rounded-lg px-2.5 py-1 text-xs font-extrabold sm:block transition-opacity ${
            isDone ? 'opacity-50' : 'opacity-100'
          }`}
          style={{
            backgroundColor: `${task.color || '#7955d6'}18`,
            color: task.color || '#7955d6',
          }}
        >
          {task.category}
        </span>
      )}

      {task.time && (
        <span
          className={`hidden items-center gap-1.5 text-xs font-bold md:flex ${
            isDone ? 'text-textPlaceholder' : 'text-lightText'
          }`}
        >
          <Icon name="clock" size={14} /> {task.time}
        </span>
      )}

      <button
        type="button"
        aria-label="Більше дій"
        className="grid size-8 shrink-0 place-items-center rounded-lg text-textPlaceholder transition-colors hover:bg-background hover:text-text cursor-pointer"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Icon name="more" size={18} />
      </button>
    </article>
  );
}
