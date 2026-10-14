import { Icon } from "../atoms/Icon"
import type { Task } from "../../types/index"

interface TaskRowProps {
  task: Task
  toggleTask: (id: number) => void
}

export function TaskRow({ task, toggleTask }: TaskRowProps) {
  return (
    <article
      className={`flex min-h-12 items-center gap-2 rounded-xl border border-[#efedf4] px-2 py-3
        transition-all hover:translate-x-0.5 hover:border-page-border-hover hover:shadow-[0_4px_15px_rgba(56,50,90,0.055)]
        ${task.done ? "bg-[#fbfbfd]" : "bg-white"}
      `}
    >
      <button
        aria-label={task.done ? "Позначити активною" : "Позначити виконаною"}
        className={`grid h-11 w-11 flex-none place-items-center rounded-[7px] border-[1.5px] transition-all ${task.done
          ? "border-[#48b99d] bg-[#48b99d] text-white"
          : "border-page-control-border text-transparent hover:border-[#8260d9]"
          }`}
        onClick={() => toggleTask(task.id)}
      >
        {task.done && <Icon name="check" size={15} />}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[15px] font-extrabold sm:text-base 
            ${task.done ? "text-[#aaa8b8] line-through" : ""}
          `}
        >
          {task.title}
        </p>
        <p className="mt-1 text-xs text-[#9997a9]">{task.meta}</p>
      </div>
      <span
        className="hidden rounded-lg px-2.5 py-1 text-xs font-extrabold sm:block"
        style={{
          backgroundColor: `${task.color}18`,
          color: task.color,
        }}
      >
        {task.category}
      </span>
      <span className="hidden items-center gap-1.5 text-xs font-bold text-[#858397] md:flex">
        <Icon name="clock" size={15} /> {task.time}
      </span>
      <button aria-label="Більше дій" className="text-[#aaa8b8]">
        <Icon name="more" size={19} />
      </button>
    </article>
  )
}
