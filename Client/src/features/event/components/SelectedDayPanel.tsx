import { Icon, Panel } from '@ui';
import type { EventModel } from '@types';
import { formatDayMonth, formatWeekday } from '../utils/calendarUtils';
import { EventCard } from './EventCard';

interface SelectedDayPanelProps {
  selectedDate: Date;
  events: EventModel[];
  onAddEvent: () => void;
  onEditEvent: (event: EventModel) => void;
}

export function SelectedDayPanel({
  selectedDate,
  events,
  onAddEvent,
  onEditEvent,
}: SelectedDayPanelProps) {
  const dayMonth = formatDayMonth(selectedDate);
  const weekday = formatWeekday(selectedDate);

  const plansCountText =
    events.length === 0
      ? 'Планів немає'
      : events.length === 1
        ? '1 запланована справа'
        : events.length < 5
          ? `${events.length} заплановані справи`
          : `${events.length} запланованих справ`;

  return (
    <div className="space-y-4">
      {/* Градієнтна панель обраного дня */}
      <Panel
        as="section"
        className="bg-gradient-to-br from-text to-primaryHover text-white"
      >
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/60">
          Обраний день
        </p>
        <p className="mt-2 text-3xl font-extrabold capitalize">{dayMonth}</p>
        <p className="mt-1.5 text-sm text-white/70">
          {weekday} · {plansCountText}
        </p>
        <button
          type="button"
          onClick={onAddEvent}
          className="mt-5 flex items-center gap-2 text-sm font-extrabold text-primarySoft hover:text-white transition-colors"
        >
          <Icon name="plus" size={17} /> Додати подію
        </button>
      </Panel>

      {/* Події обраного дня (Опція 1.3) */}
      {events.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wider text-textMuted px-1">
            Справи на цей день
          </p>
          <div className="space-y-2.5">
            {events.map(event => (
              <EventCard key={event.id} event={event} onEdit={onEditEvent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

