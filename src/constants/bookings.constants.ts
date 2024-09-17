import { capitalizeString, formatCurrency } from "@/helpers/strings.helper";
import { Booking } from "@/types/models/booking.types";
import { Row } from "@tanstack/react-table";

export const exitGateOptions = [
  { label: 'South Gate', value: 'southGate' },
  { label: 'North Gate', value: 'northGate' },
  { label: 'Mutumba Gate', value: 'mutumbaGate' },
];

export const entryGateOptions = [
  { label: 'South Gate', value: 'southGate' },
  { label: 'Mutumba Gate', value: 'mutumbaGate' },
];

export const accommodationOptions = [
  { label: 'Ruzizi Tented Lodge', value: 'ruziziTentedLodge' },
  { label: 'Karenge Bush Camp', value: 'karengeBushCamp' },
  { label: 'Camping', value: 'camping' },
  { label: 'Akagera Game Lodge', value: 'akageraGameLodge' },
  { label: 'Magashi Camp', value: 'magashiCamp' },
  { label: 'Day Visitor', value: 'dayVisitor' },
  { label: 'Driver-Guide Rooms', value: 'driverGuideRooms' },
  { label: 'Park HQ', value: 'parkHQ' },
];

export const bookingStatus = {
    IN_PROGRESS: 'in_progress',
    PENDING: 'pending',
    WAITING: 'waiting',
    QUOTE: 'quote',
    RESCHEDULE: 'reschedule',
    PAYMENT_RECEIVED: 'payment_received',
    PROOF_OF_PAYMENT: 'proof_of_payment',
    RESERVED: 'reserved',
    CONFIRMED: 'confirmed',
    PRO_FORMA_INVOICE: 'pro_forma_invoice',
    INVOICE: 'invoice',
    DEPOSIT: 'deposit',
    PAID: 'paid',
    COMPLIMENTARY: 'complimentary',
    DECLINED: 'declined',
    CANCELLED: 'cancelled',
    VOID: 'void',
    PENDING_CONTACT: 'pending_contact'
};

export const bookingPaymentMethods= [
  {
    label: 'Mobile Money or Debit/Credit Card',
    value: 'dpo'
  },
  {
    label: 'Receptionist will contact me',
    value: 'pending_contact'
  }
]

export const bookingDaysOptions = [
  {
    value: '0',
    label: 'Day visit',
  },
  {
    value: '1',
    label: '2 days',
  },
  {
    value: '2',
    label: '3 days',
  },
  {
    value: '3',
    label: '4 days',
  },
  {
    value: '4',
    label: '5 days',
  },
  {
    value: '5',
    label: '6 days',
  },
  {
    value: '6',
    label: '7 days',
  },
];

export const bookingColumns = [
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }: { row: Row<Booking> }) =>
      capitalizeString(row.original.type),
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }: { row: Row<Booking> }) =>
      formatCurrency(row?.original?.totalAmountUsd),
  },
  {
    header: 'Reference ID',
    accessorKey: 'referenceId',
  },
  {
    header: 'Name',
    accessorKey: 'name',
  },

  {
    header: 'Date',
    accessorKey: 'startDate',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Phone',
    accessorKey: 'phone',
  },
  {
    header: 'Entry Gate',
    accessorKey: 'entryGate',
    cell: ({ row }: { row: Row<Booking> }) => capitalizeString(row?.original?.entryGate),
  },
  {
    header: 'Exit Gate',
    accessorKey: 'exitGate',
    cell: ({ row }: { row: Row<Booking> }) => capitalizeString(row?.original?.exitGate),
  },
  {
    header: 'Accomodation',
    accessorKey: 'accommodation',
    cell: ({ row }: { row: Row<Booking> }) => capitalizeString(row?.original?.accomodation),
  },
  {
    header: 'Notes',
    accessorKey: 'notes',
  }
];
