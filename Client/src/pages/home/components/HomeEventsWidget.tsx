import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@ui';
import { EventCard } from '@features/event';
import { useEventsQuery } from '@hooks';
import type { EventModel } from '@types';

interface HomeEventsWidgetProps {
  onSelectEvent: (event: EventModel) => void;
}

export function HomeEventsWidget({ onSelectEvent }: HomeEventsWidgetProps) {
  const navigate = useNavigate();
  const todayIso = useMemo(() => new Date().toISOString(), []);
  const { events = [], isLoading } = useEventsQuery({
    from: todayIso,
    limit: 3,
  });

  return (
    <Panel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[19px] font-black tracking-[-0.25px]">
            Найближчі події
          </h3>
          <p className="mt-1 text-sm text-textMuted">Не пропустіть важливе</p>
        </div>
        <button
          className="cursor-pointer text-xs font-extrabold text-primary hover:underline"
          onClick={() => navigate('/calendar')}
        >
          Весь календар
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-[15px] bg-background"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-sm font-semibold text-textMuted">
            Поки що немає запланованих подій
          </p>
          <button
            className="mt-3 cursor-pointer rounded-xl bg-primarySoft px-4 py-2 text-xs font-extrabold text-primary transition-all hover:bg-primary/20"
            onClick={() => navigate('/calendar')}
          >
            Відкрити календар
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {events.map(event => (
            <EventCard
              key={`${event.id}-${event.date}`}
              event={event}
              onEdit={onSelectEvent}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}
