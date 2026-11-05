export const formatDate = (format: 'monthYear' | 'weekdayDayMonth') => {
  const date = new Date();

  const options: Intl.DateTimeFormatOptions =
    format === 'monthYear'
      ? { month: 'long', year: 'numeric' }
      : { weekday: 'long', day: 'numeric', month: 'long' };

  return date.toLocaleDateString('uk-UA', options);
};
