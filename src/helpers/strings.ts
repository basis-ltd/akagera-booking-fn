import { Activity } from '@/types/models/activity.types';
import moment from 'moment';
import { Event } from 'react-big-calendar';

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

export const generateRecurringEvents = (
  selectedActivity: Activity,
  numberOfDays = 60
) => {
  const events: Event[] = [];
  const today = moment();

  for (let i = 0; i < numberOfDays; i++) {
    const currentDay = today.clone().add(i, 'days');

    selectedActivity?.activitySchedules?.forEach((activitySchedule) => {
      const startDate = moment(
        `${formatDate(String(currentDay))} ${activitySchedule.startTime}`
      ).toDate();
      const endDate = moment(
        `${formatDate(String(currentDay))} ${activitySchedule.endTime}`
      ).toDate();

      events.push({
        title: `${selectedActivity.name} (Seats Available: 10)`,
        start: startDate,
        end: endDate,
      });
    });
  }

  return events;
};

export const removeDuplicates = (array: never[]) => {
  return array.filter((value, index) => array.indexOf(value) === index);
};
