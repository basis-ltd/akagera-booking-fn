import {
  capitalizeString,
  formatCurrency,
  formatDate,
} from '@/helpers/strings.helper';
import { ActivityRate } from '@/types/models/activityRate.types';
import { Row } from '@tanstack/react-table';

export const activityRateColumns = [
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
    header: 'Amount in USD',
    accessorKey: 'amountUsd',
    cell: ({ row }: { row: Row<ActivityRate> }) =>
      formatCurrency(row?.original?.amountUsd),
  },
  {
    header: 'Amount in RWF',
    accessorKey: 'amountRwf',
    cell: ({ row }: { row: Row<ActivityRate> }) =>
      formatCurrency(row?.original?.amountRwf, 'RWF'),
  },
  {
    header: 'Age Range',
    accessorKey: 'ageRange',
    cell: ({ row }: { row: Row<ActivityRate> }) =>
      capitalizeString(row?.original?.ageRange),
  },
  {
    header: 'Last updated',
    accessorKey: 'updatedAt',
    cell: ({ row }: { row: Row<ActivityRate> }) =>
      formatDate(row?.original?.updatedAt),
  },
];

export const ageRageOptions = [
  {
    label: 'Children (6 - 12 years)',
    value: 'children',
  },
  {
    label: 'Adults (13 and above)',
    value: 'adults',
  },
  {
    label: 'Not applicable',
    value: 'n/a',
  },
];
