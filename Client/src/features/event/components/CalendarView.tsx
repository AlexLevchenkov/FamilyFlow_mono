import { useState, useMemo } from 'react';
import { Panel, Spinner } from '@ui';
import { useEventsQuery } from '@hooks';
import type { EventModel } from '@types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { SelectedDayPanel } from './SelectedDayPanel';
import { UpcomingEventsList } from './UpcomingEventsList';
import { EventModal } from './EventModal';
import { formatDateKey, getMonthGrid } from '../utils/calendarUtils';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // Розраховуємо точні клітинки сітки (35 або 42 дні з точними хвостами)
  const cells = useMemo(() => getMonthGrid(currentDate), [currentDate]);

  // Запитуємо з сервера РІВНО той діапазон, що фізично відображається на екрані (від першої до останньої клітинки)
  const dateRange = useMemo(() => {
    if (!cells.length) return undefined;

    const firstDate = new Date(cells[0].date);
    firstDate.setHours(0, 0, 0, 0);

    const lastDate = new Date(cells[cells.length - 1].date);
    lastDate.setHours(23, 59, 59, 999);

    return {
      from: firstDate.toISOString(),
      to: lastDate.toISOString(),
      limit: 9999,
    };
  }, [cells]);

  const { events = [], isLoading } = useEventsQuery(dateRange);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventModel | null>(null);

  // Навігація календаря
  const handlePrevMonth = () => {
    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    // Якщо користувач натиснув день іншого місяця (із сірого хвоста), перемикаємо перегляд на цей місяць
    if (date.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: EventModel) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  // Групуємо події за датою YYYY-MM-DD для миттєвого доступу в сітці
  const eventsByDate = useMemo(() => {
    const map = new Map<string, EventModel[]>();

    events.forEach(ev => {
      const d = new Date(ev.date);
      if (!isNaN(d.getTime())) {
        const key = formatDateKey(d);
        const list = map.get(key) || [];
        list.push(ev);
        map.set(key, list);
      }
    });

    return map;
  }, [events]);

  // Події саме для обраного дня
  const selectedDayEvents = useMemo(() => {
    const key = formatDateKey(selectedDate);
    return eventsByDate.get(key) || [];
  }, [eventsByDate, selectedDate]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.55fr)]">
      {/* Ліва колонка: Сітка календаря */}
      <Panel as="section">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />

        <Spinner isLoading={isLoading}>
          <CalendarGrid
            cells={cells}
            currentDate={currentDate}
            selectedDate={selectedDate}
            eventsByDate={eventsByDate}
            onSelectDate={handleSelectDate}
          />
        </Spinner>
      </Panel>

      {/* Права колонка: Панель обраного дня та список найближчих подій */}
      <div className="space-y-6">
        <SelectedDayPanel
          selectedDate={selectedDate}
          events={selectedDayEvents}
          onAddEvent={handleOpenAddModal}
          onEditEvent={handleOpenEditModal}
        />

        <UpcomingEventsList
          onAddEvent={handleOpenAddModal}
          onEditEvent={handleOpenEditModal}
        />
      </div>

      {/* Модальне вікно створення / редагування події */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={editingEvent}
        defaultDate={selectedDate}
      />
    </div>
  );
}
