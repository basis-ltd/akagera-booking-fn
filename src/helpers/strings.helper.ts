import moment from 'moment';

export const formatDate = (date: string | Date) => {
  return moment(date).format('YYYY-MM-DD');
};

// CAPITALIZE STRING
export const capitalizeString = (string: string | undefined | null) => {
  if (!string) return "";
  const isCamelCase = /^[a-z]+([A-Z][a-z])$/.test(string);
  if (isCamelCase) return capitalizeCamelCase(string)
  const words = string?.toLowerCase()?.split("_");
  const capitalizedWords =
    words && words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords && capitalizedWords.join(" ");
};

// CAPITALIZE CAMEL CASE
export function capitalizeCamelCase(string: string){
  return string
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, function(str) { return str.toUpperCase(); })
      .trim();
}

// FORMAT TIME
export const formatTime = (time: string | Date) => {
  return moment(time, 'HH:mm:ss').format('hh:mm A');
};

export const removeDuplicates = (array: never[]) => {
  return array.filter((value, index) => array.indexOf(value) === index);
};

export const formatCurrency = (amount: number, currency = 'RWF') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
