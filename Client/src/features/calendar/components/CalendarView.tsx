import { useEffect, useState } from 'react';
import { Icon, IconButton, Panel, PrimaryButton } from '@ui';
import { EventCard } from './EventCard';
import { useCalendarStore } from '../store/calendar.store';

interface CalendarProps {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
}

const calendarDays = [
  23, 24, 25, 26, 27, 28, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  1, 2, 3, 4, 5,
];

export function CalendarView({ selectedDay, setSelectedDay }: CalendarProps) {
  const events = useCalendarStore(state => state.events);
  const loading = useCalendarStore(state => state.loading);
  const error = useCalendarStore(state => state.error);
  const loadEvents = useCalendarStore(state => state.loadEvents);
  const createEvent = useCalendarStore(state => state.createEvent);
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-03-26');

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const selectedEvents = events.filter(
    event => event.day === selectedDay && event.month.startsWith('БЕР')
  );

  async function submitEvent() {
    if (!title.trim() || !date) return;
    await createEvent(title.trim(), new Date(`${date}T18:00:00`).toISOString());
    if (!useCalendarStore.getState().error) {
      setTitle('');
      setShowComposer(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,.55fr)]">
      <Panel as="section">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black tracking-tight">Березень 2026</h2>
            <p className="mt-1 text-sm text-[#9290a4]">Усі плани родини на місяць</p>
          </div>
          <div className="flex gap-2">
            <IconButton aria-label="Попередній місяць">
              <span className="rotate-180"><Icon name="chevron" size={17} /></span>
            </IconButton>
            <IconButton aria-label="Наступний місяць">
              <Icon name="chevron" size={17} />
            </IconButton>
          </div>
        </div>
        <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-extrabold uppercase tracking-widest text-page-faint max-sm:gap-1">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map(day => <span key={day}>{day}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-2 max-sm:gap-1">
          {calendarDays.map((day, index) => {
            const muted = index < 6 || index > 36;
            const hasEvent = !muted && events.some(event => event.day === day && event.month.startsWith('БЕР'));
            return (
              <button
                className={`relative flex min-h-18 items-start justify-end rounded-xl border p-2.5 text-xs font-black transition-all duration-150 ease-in-out max-sm:min-h-12 max-sm:rounded-lg max-sm:p-2 ${
                  muted
                    ? 'border-page-border bg-page-surface text-page-control-border'
                    : selectedDay === day
                      ? 'border-selected bg-selected text-white shadow-[0_7px_18px_var(--color-page-shadow-accent)]'
                      : 'border-page-border text-page-control hover:border-page-border-accent hover:bg-page-surface'
                }`}
                key={`${day}-${index}`}
                onClick={() => !muted && setSelectedDay(day)}
              >
                <span>{day}</span>
                {hasEvent && (
                  <i className={`absolute bottom-2.5 left-2.5 size-1.5 rounded-full max-sm:bottom-1.5 max-sm:left-1.5 max-sm:size-1 ${selectedDay === day ? 'bg-white' : 'bg-selected'}`} />
                )}
              </button>
            );
          })}
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel as="section" className="bg-gradient-to-br from-[#302b66] to-[#6051a6] text-white">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/55">Обраний день</p>
          <p className="mt-2 text-3xl font-extrabold">{selectedDay} березня</p>
          <p className="mt-2 text-sm text-white/65">
            {selectedEvents.length} заплановані події
          </p>
          <button
            className="mt-5 flex items-center gap-2 text-sm font-extrabold text-[#ddd4ff]"
            onClick={() => {
              setDate(`2026-03-${String(selectedDay).padStart(2, '0')}`);
              setShowComposer(value => !value);
            }}
          >
            <Icon name="plus" size={17} /> Додати подію
          </button>
        </Panel>

        {showComposer && (
          <Panel as="section">
            <input
              aria-label="Назва події"
              className="w-full rounded-xl border border-[#e5e1f2] px-4 py-2.5 text-sm outline-none focus:border-[#8b63de]"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Назва події"
            />
            <input
              aria-label="Дата події"
              className="mt-2 w-full rounded-xl border border-[#e5e1f2] px-4 py-2.5 text-sm outline-none focus:border-[#8b63de]"
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
            />
            <PrimaryButton className="mt-3" onClick={() => void submitEvent()}>
              Зберегти
            </PrimaryButton>
          </Panel>
        )}

        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="text-sm text-[#9290a4]">Завантаження подій…</p>}
        <Panel as="section">
          <h2 className="text-lg font-black tracking-tight">Найближчі події</h2>
          <div className="mt-5 space-y-3">
            {events.slice(0, 5).map(event => (
              <EventCard key={event.id} {...event} />
            ))}
            {!events.length && !loading && <p className="text-sm text-[#9290a4]">Подій поки немає.</p>}
          </div>
        </Panel>
      </div>
    </div>
  );
}
