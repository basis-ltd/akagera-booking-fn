import { capitalizeString } from '@/helpers/strings.helper';
import { User } from '@/types/models/user.types';
import { Row } from '@tanstack/react-table';

export const userColumns = [
  {
    header: 'No',
    accessorKey: 'no',
  },
  {
    header: 'Role',
    accessorKey: 'role',
    cell: ({ row }: { row: Row<User> }) =>
      capitalizeString(row?.original?.role),
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Phone',
    accessorKey: 'phone',
  },
];

export const userRoles = [
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'Receptionist',
    value: 'receptionist',
  },
];
