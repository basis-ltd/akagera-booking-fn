import { formatTime } from '@/helpers/strings.helper';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { Row } from '@tanstack/react-table';

export const bookingActivitiesColumns = [
  {
    header: 'No',
    accessorKey: 'no',
  },
  {
    header: 'Activity',
    accessorKey: 'activity.name',
  },
  {
    header: 'Start Time',
    accessorKey: 'startTime',
    cell: ({ row }: { row: Row<BookingActivity> }) =>
      formatTime(row?.original?.startTime),
  },
  {
    header: 'End Time',
    accessorKey: 'endTime',
    cell: ({ row }: { row: Row<BookingActivity> }) =>
      formatTime(String(row?.original?.endTime)),
  },
  {
    header: 'Number of adults',
    accessorKey: 'numberOfAdults',
  },
  {
    header: 'Number of children',
    accessorKey: 'numberOfChildren',
  },
  {
    header: 'Price',
    accessorKey: 'price',
  },
];
