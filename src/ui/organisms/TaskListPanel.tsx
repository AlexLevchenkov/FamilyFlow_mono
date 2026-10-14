import { Icon } from "../atoms/Icon"
import { Panel } from "../atoms/Panel"
import { PrimaryButton } from "../atoms/PrimaryButton"
import { TaskRow } from "../molecules/TaskRow"
import type { Task } from "../../types/index"

interface TaskListPanelProps {
  title: string
  description: string
  visibleTasks: Task[]
  filter: string
  setFilter: (filter: string) => void
  showComposer: boolean
  setShowComposer: (show: boolean) => void
  newTask: string
  setNewTask: (task: string) => void
  addTask: () => void
  toggleTask: (id: number) => void
  showHeaderAdd?: boolean
  showFooterAdd?: boolean
}

const filters = ["Всі", "Активні", "Виконані"]

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
  toggleTask,
  showHeaderAdd = false,
  showFooterAdd = false,
}: TaskListPanelProps) {
  return (
    <Panel as="section">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[19px] font-black tracking-[-0.25px]">{title}</h2>
          <p className="mt-1 text-sm text-[#9290a4]">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#f2f1f8] p-1">
            {filters.map((item) => (
              <button
                className={`rounded-[9px] px-3 py-1.5 text-xs font-extrabold transition-all ${filter === item
                  ? "bg-white text-[#6445c2] shadow-[0_2px_8px_rgba(54,48,88,0.09)]"
                  : "text-[#8f8da0]"
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

      <div className="space-y-2.5">
        {visibleTasks.map((task) => (
          <TaskRow key={task.id} task={task} toggleTask={toggleTask} />
        ))}
      </div>

      {showComposer && (
        <div className="mt-3 flex flex-col gap-2 rounded-2xl border border-[#d9d2f4] bg-[#faf9ff] p-3 sm:flex-row">
          <input
            autoFocus
            className="min-w-0 flex-1 rounded-xl border border-[#e5e1f2] bg-white px-4 py-2.5 text-sm font-bold outline-none focus:border-[#8b63de]"
            onChange={(event) => setNewTask(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && addTask()}
            placeholder="Напишіть нову справу..."
            value={newTask}
          />
          <PrimaryButton className="justify-center" onClick={addTask}>
            Додати
          </PrimaryButton>
          <button
            className="px-3 text-sm font-extrabold text-[#88869a]"
            onClick={() => setShowComposer(false)}
          >
            Скасувати
          </button>
        </div>
      )}

      {showFooterAdd && !showComposer && (
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-[14px] border border-dashed border-page-border-accent p-3 text-xs font-black
          text-page-accent-bright transition-all hover:border-page-border-accent hover:bg-page-lavender-active"
          onClick={() => setShowComposer(true)}
        >
          <Icon name="plus" size={18} /> Додати нову справу
        </button>
      )}
    </Panel>
  )
}