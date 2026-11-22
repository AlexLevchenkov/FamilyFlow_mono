import { useMemo } from 'react';
import { Panel, Icon, Spinner } from '@ui';
import { useEventsQuery } from '@hooks';
import type { EventModel } from '@types';
import { EventCard } from './EventCard';

interface UpcomingEventsListProps {
  events?: EventModel[];
  onEditEvent: (event: EventModel) => void;
  onAddEvent: () => void;
}

export function UpcomingEventsList({
  events: propEvents,
  onEditEvent,
  onAddEvent,
}: UpcomingEventsListProps) {
  const todayIso = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }, []);

  const { events: fetchedEvents = [], isLoading } = useEventsQuery(
    propEvents ? undefined : { from: todayIso, limit: 10 }
  );

  const events = propEvents ?? fetchedEvents;

  return (
    <Panel as="section">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">Найближчі події</h2>
        <button
          type="button"
          onClick={onAddEvent}
          className="text-xs font-bold text-primary hover:text-primaryHover transition-colors flex items-center gap-1"
        >
          <Icon name="plus" size={14} /> Додати
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        <Spinner isLoading={isLoading && !propEvents}>
          {events.length === 0 ? (
            <div className="py-8 text-center text-xs text-textPlaceholder">
              <p>Немає запланованих подій</p>
            </div>
          ) : (
            events.map(event => (
              <EventCard key={event.id} event={event} onEdit={onEditEvent} />
            ))
          )}
        </Spinner>
      </div>
    </Panel>
  );
}
