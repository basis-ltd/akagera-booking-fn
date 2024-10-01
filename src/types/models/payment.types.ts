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
  transactionId?: string;
};

export type DPOPaymentVerificationType = {
  Result: string;
  ResultExplanation: string;
  CustomerName?: string;
  CustomerCredit: string;
  CustomerCreditType: string;
  TransactionApproval: string;
  TransactionCurrency: string;
  TransactionAmount: string;
  FraudAlert: string;
  FraudExplanation: string;
  TransactionNetAmount: string;
  TransactionSettlementDate: string;
  TransactionRollingReserveAmount: string;
  TransactionRollingReserveDate: string;
  CustomerPhone?: string;
  CustomerCountry?: string;
  CustomerAddress?: string;
  CustomerCity?: string;
  CustomerZip?: string;
  MobilePaymentRequest: string;
  AccRef?: string;
  TransactionFinalCurrency: string;
  TransactionFinalAmount: string;
};
