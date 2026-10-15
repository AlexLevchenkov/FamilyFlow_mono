import { useState } from 'react';
import { CalendarView } from '@features/calendar';

export function Calendar() {
  const [selectedDay, setSelectedDay] = useState(26);
  return (
    <CalendarView selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
  );
}
