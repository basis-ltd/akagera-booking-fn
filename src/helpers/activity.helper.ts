export const dayHoursArray = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const value = String(hour).padStart(2, '0') + ':' + minute + ':00';
  const label = String(hour).padStart(2, '0') + ':' + minute;
  return { value, label };
});
