import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Panel } from '@ui';
import { useEventsQuery } from '@hooks';

function pluralizeEvents(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${count} сімейних подій`;
  if (mod10 === 1) return `${count} сімейну подію`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} сімейні події`;
  return `${count} сімейних подій`;
}

export function HomeCalloutBanner() {
  const navigate = useNavigate();

  const { fromIso, toIso } = useMemo(() => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Mon = 0
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return {
      fromIso: startOfWeek.toISOString(),
      toIso: endOfWeek.toISOString(),
    };
  }, []);

  const { events = [] } = useEventsQuery({
    from: fromIso,
    to: toIso,
  });

  const familyEventsCount = useMemo(() => {
    return (events || []).filter(e => e.visibility === 'shared').length;
  }, [events]);

  const detailText =
    familyEventsCount > 0
      ? `Ви запланували ${pluralizeEvents(familyEventsCount)} цього тижня.`
      : 'Плануйте спільні події для всієї родини разом.';

  return (
    <Panel
      className="flex cursor-pointer items-center justify-between gap-5 bg-linear-to-br from-text to-primaryHover text-white transition-all hover:opacity-95 hover:shadow-md"
      onClick={() => navigate('/calendar')}
    >
      <div className="flex items-center gap-5">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-[20px] bg-white/12 text-textPlaceholder">
          <Icon name="users" size={27} />
        </div>
        <div>
          <p className="text-lg font-extrabold">Спільний час має значення</p>
          <p className="mt-1 text-sm leading-5 text-white/65">{detailText}</p>
        </div>
      </div>
      <Icon name="chevron" size={20} />
    </Panel>
  );
}
