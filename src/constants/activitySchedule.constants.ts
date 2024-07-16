import { formatTime } from '@/helpers/strings.helper';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { Row } from '@tanstack/react-table';

export const activityScheduleColumns = [
  {
    header: 'Start Time',
    accessorKey: 'startTime',
    cell: ({ row }: { row: Row<ActivitySchedule> }) =>
      formatTime(row?.original?.startTime),
  },
  {
    header: 'End Time',
    accessorKey: 'endTime',
    cell: ({ row }: { row: Row<ActivitySchedule> }) =>
      formatTime(String(row?.original?.endTime)),
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Disclaimer',
    accessorKey: 'discalimer',
  },
];
