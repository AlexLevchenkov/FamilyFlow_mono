import { useState, useRef, useMemo } from 'react';
import { useTasksManager } from '@features/tasks';
import { EventModal } from '@features/event';
import type { EventModel } from '@types';
import {
  HeroBanner,
  HomeTasksSection,
  HomeFamilyWidget,
  HomeProgressWidget,
  HomeEventsWidget,
  HomeCalloutBanner,
} from './home/components';

export function Home() {
  const { fromIso, toIso } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(startOfToday.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      fromIso: startOfToday.toISOString(),
      toIso: endOfWeek.toISOString(),
    };
  }, []);

  const {
    tasks,
    visibleTasks,
    completed,
    progress,
    todayActiveTasksCount,
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
  } = useTasksManager({
    from: fromIso,
    to: toIso,
    limit: 100,
  });

  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const tasksSectionRef = useRef<HTMLDivElement>(null);

  const handleOpenComposer = () => {
    setShowComposer(true);
    tasksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroBanner
        activeTasksCount={todayActiveTasksCount}
        onAddTask={handleOpenComposer}
      />

      <div
        ref={tasksSectionRef}
        className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(310px,.75fr)]"
      >
        <HomeTasksSection
          tasks={tasks}
          visibleTasks={visibleTasks}
          completed={completed}
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
          groupByDay={true}
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          <HomeFamilyWidget />
          <HomeProgressWidget
            completed={completed}
            total={tasks.length}
            progress={progress}
          />
        </div>
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <HomeEventsWidget onSelectEvent={setSelectedEvent} />
        <HomeCalloutBanner />
      </section>

      {selectedEvent && (
        <EventModal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />
      )}
    </>
  );
}
