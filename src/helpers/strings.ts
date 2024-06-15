import moment from 'moment';

export const formatDate = (date: string | Date) => {
  return moment(date).format('YYYY-MM-DD');
};

export const capitalizeString = (string: string) => {
  if (!string) return '';
  const words = string?.toLowerCase().split('_');
  const capitalizedWords =
    words && words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords && capitalizedWords.join(' ');
};
