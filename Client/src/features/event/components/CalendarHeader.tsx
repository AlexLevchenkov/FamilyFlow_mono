import { Icon, IconButton } from '@ui';
import { formatMonthYear } from '../utils/calendarUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const formattedMonth = formatMonthYear(currentDate);
  const capitalizedMonth =
    formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-black tracking-tight">{capitalizedMonth}</h2>
        <p className="mt-0.5 text-xs text-lightText">Усі плани родини на місяць</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToday}
          className="rounded-xl border border-border bg-panelsColor px-3 py-1.5 text-xs font-bold text-text hover:border-primaryMuted hover:bg-background transition-colors"
        >
          Сьогодні
        </button>

        <IconButton
          aria-label="Попередній місяць"
          title="Попередній місяць"
          onClick={onPrevMonth}
        >
          <span className="rotate-180 inline-block">
            <Icon name="chevron" size={17} />
          </span>
        </IconButton>

        <IconButton
          aria-label="Наступний місяць"
          title="Наступний місяць"
          onClick={onNextMonth}
        >
          <Icon name="chevron" size={17} />
        </IconButton>
      </div>
    </div>
  );
}

