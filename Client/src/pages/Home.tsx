import { useState, useRef, useMemo, useCallback } from 'react';
import { useTasksQuery } from '@hooks';
import {
  mapTaskModelToUiTask,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  type Task,
} from '@features/tasks';
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

  const { tasks: backendTasks = [] } = useTasksQuery({
    from: fromIso,
    to: toIso,
    limit: 100,
  });

  const createTaskMutation = useCreateTaskMutation();
  const updateTaskMutation = useUpdateTaskMutation();

  const [filter, setFilter] = useState('Всі');
  const [showComposer, setShowComposer] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventModel | null>(null);
  const tasksSectionRef = useRef<HTMLDivElement>(null);

  const tasks: Task[] = useMemo(() => {
    return (backendTasks || []).map(mapTaskModelToUiTask);
  }, [backendTasks]);

  const visibleTasks = useMemo(() => {
    if (filter === 'Виконані') return tasks.filter(task => task.done);
    if (filter === 'Активні') return tasks.filter(task => !task.done);
    return tasks;
  }, [filter, tasks]);

  const completed = useMemo(
    () => tasks.filter(task => task.done).length,
    [tasks]
  );

  const progress = useMemo(
    () => (tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0),
    [tasks.length, completed]
  );

  const todayActiveTasksCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return tasks.filter(t => {
      if (t.done) return false;
      const d = t.rawTask?.date ? new Date(t.rawTask.date) : new Date();
      return d.toDateString() === todayStr;
    }).length;
  }, [tasks]);

  const handleOpenComposer = () => {
    setShowComposer(true);
    tasksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTask = useCallback(
    (id: number) => {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const raw = task.rawTask;
      updateTaskMutation.mutate({
        id,
        dto: {
          title: raw?.title || task.title,
          type: raw?.type || task.type || 'home',
          visibility: raw?.visibility || task.visibility || 'shared',
          status: !task.done,
          date: raw?.date ? new Date(raw.date) : new Date(),
        },
      });
    },
    [tasks, updateTaskMutation]
  );

  const addTask = useCallback(() => {
    if (!newTask.trim()) return;

    createTaskMutation.mutate(
      {
        title: newTask.trim(),
        type: 'personal',
        visibility: 'shared',
        date: new Date(),
      },
      {
        onSuccess: () => {
          setNewTask('');
          setShowComposer(false);
        },
      }
    );
  }, [newTask, createTaskMutation]);

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
          toggleTask={toggleTask}
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
