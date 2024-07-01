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
    CASH_RECEIVED: 'cash_received',
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
    label: 'DPO',
    value: 'dpo'
  },
  {
    label: 'Mobile Money',
    value: 'mobile_money'
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
