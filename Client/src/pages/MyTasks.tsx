import { Panel } from '@ui';
import { TaskListPanel, useTasksManager } from '@features/tasks';

export function MyTasks() {
  const {
    tasks,
    visibleTasks,
    completed,
    activeCount,
    todayTasksCount,
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
  } = useTasksManager({ limit: 100 });

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ['Активні', activeCount, 'Потребують уваги', '#7656d0'],
          ['Виконані', completed, 'Гарний темп', '#39b29d'],
          [
            'На сьогодні',
            todayTasksCount,
            todayTasksCount > 0
              ? 'Заплановано на день'
              : 'Немає запланованих на сьогодні',
            '#e87891',
          ],
        ].map(([label, value, detail, color]) => (
          <Panel key={label as string}>
            <div
              className="mb-4 h-2 w-12 rounded-full"
              style={{ backgroundColor: color as string }}
            />
            <p className="text-sm font-bold text-lightText">{label}</p>
            <p className="mt-2 text-3xl font-extrabold">{value}</p>
            <p className="mt-1 text-xs font-bold text-textPlaceholder">
              {detail}
            </p>
          </Panel>
        ))}
      </section>

      <TaskListPanel
        title="Усі справи"
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
        showHeaderAdd
        groupByDay={true}
      />
    </div>
  );
}
