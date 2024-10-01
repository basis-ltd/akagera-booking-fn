import { formatCurrency } from '@/helpers/strings.helper';
import { Payment } from '@/types/models/payment.types';
import { Row } from '@tanstack/react-table';

export const paymentColumns = [
  {
    header: 'No',
    accessorKey: 'no',
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }: { row: Row<Payment> }) =>
      formatCurrency(row?.original?.amount, row?.original?.currency),
  },
  {
    header: 'Currency',
    accessorKey: 'currency',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Payment Date',
    accessorKey: 'createdAt',
  },
];
