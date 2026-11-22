export interface CalendarCellData {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dateKey: string;
}

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('uk-UA', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatDayMonth(date: Date): string {
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
  });
}

export function formatWeekday(date: Date): string {
  const raw = date.toLocaleDateString('uk-UA', { weekday: 'long' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function formatEventTime(date: Date | string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Весь день';
  const hours = d.getHours();
  const minutes = d.getMinutes();
  if (hours === 0 && minutes === 0) return 'Весь день';
  return d.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMonthGrid(currentDate: Date): CalendarCellData[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();

  // Перший день місяця (0 = Неділя, 1 = Понеділок... у JS)
  const firstDayOfMonth = new Date(year, month, 1);
  // Перетворюємо так, щоб Понеділок = 0, Неділя = 6
  const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  // Останній день поточного місяця
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

  // Останній день попереднього місяця
  const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCellData[] = [];

  // Дні попереднього місяця ("хвіст")
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = lastDateOfPrevMonth - i;
    const date = new Date(year, month - 1, day);
    cells.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      dateKey: formatDateKey(date),
    });
  }

  // Дні поточного місяця
  for (let day = 1; day <= lastDateOfMonth; day++) {
    const date = new Date(year, month, day);
    cells.push({
      date,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      dateKey: formatDateKey(date),
    });
  }

  // Дні наступного місяця, щоб заповнити сітку до кратності 7 (35 або 42 клітинки)
  const remainingCells = (7 - (cells.length % 7)) % 7;
  // Якщо клітинок 35 і місяць ще не закінчився або сітка 5 рядків, можна дотягнути до 42 для стабільної висоти або 35/42
  const targetTotal = cells.length + remainingCells < 35 ? 35 : cells.length + remainingCells;
  const daysToAdd = targetTotal - cells.length;

  for (let day = 1; day <= daysToAdd; day++) {
    const date = new Date(year, month + 1, day);
    cells.push({
      date,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      dateKey: formatDateKey(date),
    });
  }

  return cells;
}

