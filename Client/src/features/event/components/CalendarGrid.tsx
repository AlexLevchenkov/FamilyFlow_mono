import type { EventModel } from '@types';
import {
  getMonthGrid,
  isSameDay,
  WEEKDAYS,
  type CalendarCellData,
} from '../utils/calendarUtils';
import { CalendarCell } from './CalendarCell';

interface CalendarGridProps {
  cells?: CalendarCellData[];
  currentDate: Date;
  selectedDate: Date;
  eventsByDate: Map<string, EventModel[]>;
  onSelectDate: (date: Date) => void;
}

export function CalendarGrid({
  cells: propCells,
  currentDate,
  selectedDate,
  eventsByDate,
  onSelectDate,
}: CalendarGridProps) {
  const cells = propCells || getMonthGrid(currentDate);

  return (
    <div>
      {/* Дні тижня */}
      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-extrabold uppercase tracking-widest text-textPlaceholder max-sm:gap-1">
        {WEEKDAYS.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>

      {/* Сітка днів */}
      <div className="grid grid-cols-7 gap-2 max-sm:gap-1">
        {cells.map((cell, idx) => {
          const isSelected = isSameDay(cell.date, selectedDate);
          const cellEvents = eventsByDate.get(cell.dateKey) || [];

          return (
            <CalendarCell
              key={`${cell.dateKey}-${idx}`}
              cell={cell}
              isSelected={isSelected}
              events={cellEvents}
              onSelect={() => onSelectDate(cell.date)}
            />
          );
        })}
      </div>
    </div>
  );
}
