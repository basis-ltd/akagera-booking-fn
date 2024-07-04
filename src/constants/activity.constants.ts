import { formatDate } from '@/helpers/strings.helper';
import { Activity } from '@/types/models/activity.types';
import { Row } from '@tanstack/react-table';

export const activitiesColumns = [
  {
    header: 'No',
    accessorKey: 'no',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Description',
    accessorKey: 'description',
  },
  {
    header: 'Disclaimer',
    accessorKey: 'disclaimer',
  },
  {
    header: 'Last Updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<Activity> }) =>
      formatDate(row?.original?.updatedAt),
  },
];
