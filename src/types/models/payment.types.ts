import { UUID } from 'crypto';

export type Payment = {
  id: UUID;
  amount: number | string;
  bookingId: UUID;
  paymentIntendId: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CONFIRMED';
  createdAt: Date | string;
  updatedAt: Date | string;
  currency?: string;
};
