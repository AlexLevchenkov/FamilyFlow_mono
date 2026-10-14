import { Panel } from "@ui"
import { TaskListPanel, useTasksContext } from "@features/tasks"

export function MyTasks() {
  const {
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
    loading,
    error,
  } = useTasksContext()
  const dueToday = tasks.filter(
    task =>
      task.dueDate &&
      new Date(task.dueDate).toDateString() === new Date().toDateString()
  ).length
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          [
            "Активні",
            tasks.length - completed,
            "Потребують уваги",
            "#7656d0",
          ],
          ["Виконані", completed, "Гарний темп", "#39b29d"],
          ["На сьогодні", dueToday, dueToday ? "Заплановано на сьогодні" : "Немає справ на сьогодні", "#e87891"],
        ].map(([label, value, detail, color]) => (
          <Panel key={label as string}>
            <div
              className="mb-4 h-2 w-12 rounded-full"
              style={{ backgroundColor: color as string }}
            />
            <p className="text-sm font-bold text-[#8f8da0]">{label}</p>
            <p className="mt-2 text-3xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs font-bold text-[#aaa8b8]">
              {detail}
            </p>
          </Panel>
        ))}
      </section>

      <TaskListPanel
        title="Усі справи"
        description="Плануйте особисті й сімейні задачі в одному списку"
        visibleTasks={visibleTasks}
        filter={filter}
        setFilter={setFilter}
        showComposer={showComposer}
        setShowComposer={setShowComposer}
        newTask={newTask}
        setNewTask={setNewTask}
        addTask={addTask}
        toggleTask={toggleTask}
        loading={loading}
        error={error}
        showHeaderAdd
      />
    </div>
  )
}
