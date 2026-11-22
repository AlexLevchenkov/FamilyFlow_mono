import type { EventModel } from '@types';
import { Icon } from '@ui';
import { formatEventTime } from '../utils/calendarUtils';

const REPEATABILITY_LABELS: Record<string, string> = {
  day: 'Щодня',
  working: 'У робочі дні',
  week: 'Щотижня',
  month: 'Щомісяця',
  quarter: 'Щокварталу',
  year: 'Щороку',
};

interface EventCardProps {
  event?: EventModel;
  day?: number | string;
  month?: string;
  title?: string;
  time?: string;
  color?: string;
  onEdit?: (event: EventModel) => void;
}

export function EventCard(props: EventCardProps) {
  const { event, onEdit } = props;

  let day = props.day ?? '';
  let month = props.month ?? '';
  let title = props.title ?? '';
  let time = props.time ?? '';
  let color = props.color ?? '#7955d6';
  let repeatability = event?.repeatability;

  if (event) {
    const dateObj = new Date(event.date);
    if (!isNaN(dateObj.getTime())) {
      day = String(dateObj.getDate()).padStart(2, '0');
      month = dateObj.toLocaleDateString('uk-UA', { month: 'short' }).slice(0, 3);
      time = formatEventTime(event.date);
    }
    title = event.title;
    color = event.color || '#7955d6';
    repeatability = event.repeatability;
  }

  return (
    <article
      onClick={() => event && onEdit?.(event)}
      className={`group rounded-[15px] border border-background bg-panelsColor p-3 transition-all hover:-translate-y-0.5 hover:border-borderHover hover:shadow-sm ${
        event && onEdit ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-11 flex-none flex-col items-center justify-center rounded-xl text-base font-black transition-transform group-hover:scale-105"
          style={{ color, backgroundColor: `${color}18` }}
        >
          <span className="text-[10px] uppercase tracking-wider">{month}</span>
          <span className="leading-tight">{day}</span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-text group-hover:text-primary transition-colors">
            {title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs font-bold text-textPlaceholder">
            <span>{time}</span>
            {repeatability && repeatability !== 'none' && (
              <>
                <span>•</span>
                <span>{REPEATABILITY_LABELS[repeatability] || repeatability}</span>
              </>
            )}
            {event?.visibility === 'personal' && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-primary">
                  <Icon name="lock" size={11} /> Лише для мене
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
