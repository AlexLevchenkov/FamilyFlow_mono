import type { EventModel } from '@types';
import type { CalendarCellData } from '../utils/calendarUtils';

interface CalendarCellProps {
  cell: CalendarCellData;
  isSelected: boolean;
  events: EventModel[];
  onSelect: () => void;
}

export function CalendarCell({
  cell,
  isSelected,
  events,
  onSelect,
}: CalendarCellProps) {
  const { dayNumber, isCurrentMonth, isToday } = cell;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex min-h-18 flex-col items-end justify-between rounded-xl border p-2 text-xs font-black transition-all duration-150 ease-in-out max-sm:min-h-12 max-sm:rounded-lg max-sm:p-1.5 ${
        !isCurrentMonth
          ? 'border-border/60 bg-panelsColor/40 text-textPlaceholder hover:border-border'
          : isSelected
            ? 'border-primary bg-primary text-white shadow-[0_6px_18px_var(--color-shadowAccent)]'
            : isToday
              ? 'border-primary/50 bg-primarySoft/30 text-primary hover:border-primary'
              : 'border-border bg-panelsColor text-text hover:border-primaryMuted hover:bg-panelsColor'
      }`}
    >
      <span className="flex items-center gap-1">
        {dayNumber}
        {isToday && (
          <span
            className={`hidden h-1.5 w-1.5 rounded-full sm:inline-block ${
              isSelected ? 'bg-white' : 'bg-primary'
            }`}
            title="Сьогодні"
          />
        )}
      </span>

      {/* Опція 2.1: Кольорові крапки подій */}
      {events.length > 0 && (
        <div className="flex w-full items-center gap-1 overflow-hidden pt-1 max-sm:gap-0.5">
          {events.slice(0, 3).map((ev, idx) => (
            <span
              key={`${ev.id}-${idx}`}
              className="h-1.5 w-1.5 shrink-0 rounded-full transition-transform max-sm:h-1 max-sm:w-1"
              style={{
                backgroundColor: isSelected ? '#ffffff' : ev.color || '#7955d6',
              }}
              title={ev.title}
            />
          ))}
          {events.length > 3 && (
            <span
              className={`text-[9px] font-bold leading-none ${
                isSelected ? 'text-white/80' : 'text-textPlaceholder'
              }`}
            >
              +{events.length - 3}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

