import { formatDateTime, formatTime } from '@/helpers/strings.helper';
import {
  ActivitySchedule,
  SeatsAdjustment,
} from '@/types/models/activitySchedule.types';
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

export const seatsAdjustmentsColumns = [
  {
    header: 'Start Date',
    accessorKey: 'startDate',
  },
  {
    header: 'End Date',
    accessorKey: 'endDate',
  },
  {
    header: 'Adjusted Seats',
    accessorKey: 'adjustedSeats',
  },
  {
    header: 'Reason',
    accessorKey: 'reason',
  },
  {
    header: 'Date added',
    accessorKey: 'createdAt',
    cell: ({ row }: { row: Row<SeatsAdjustment> }) =>
      `${formatDateTime(row?.original?.createdAt)}`,
  },
  {
    header: 'Added by',
    accessorKey: 'user.name',
    cell: ({ row }: { row: Row<SeatsAdjustment> }) => row?.original?.user?.name,
  },
];
