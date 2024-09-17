import { calculateActivityPrice } from '@/helpers/booking.helper';
import { formatCurrency } from '@/helpers/strings.helper';
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
    cell: ({ row }: { row: Row<BookingActivity> }) => {
      return (
        row?.original?.activity?.activitySchedules?.length > 0
          ? row?.original?.startTime
          : ''
      )
    },
  },
  {
    header: 'End Time',
    accessorKey: 'endTime',
    cell: ({ row }: { row: Row<BookingActivity> }) =>
      row?.original?.activity?.activitySchedules?.length > 0
        ? moment(row?.original?.endTime).format('hh:mm A')
        : '',
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
    cell: ({ row }: { row: Row<BookingActivity> }) =>
      `${formatCurrency(calculateActivityPrice(row.original))}`,
  },
];
