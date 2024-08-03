import { BookingActivity } from '@/types/models/bookingActivity.types';
import { Row } from '@tanstack/react-table';
import moment from 'moment';

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
      row?.original?.activity?.activitySchedules?.length > 0 ?
      moment(row?.original?.startTime).format('hh:mm A'): '',
  },
  {
    header: 'End Time',
    accessorKey: 'endTime',
    cell: ({ row }: { row: Row<BookingActivity> }) =>
      row?.original?.activity?.activitySchedules?.length > 0 ?
      moment(row?.original?.endTime).format('hh:mm A'): '',
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
    header: 'Number of cars/boats/tents',
    accessorKey: 'numberOfSeats',
    cell: ({ row }: { row: Row<BookingActivity> }) =>
      Number(row?.original?.numberOfSeats) > 1
        ? `${row?.original?.numberOfSeats}`
        : ``,
  },
  {
    header: 'Price',
    accessorKey: 'price',
  },
];
