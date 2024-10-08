import { DPOPaymentVerificationType, Payment } from '@/types/models/payment.types';
import { createSlice } from '@reduxjs/toolkit';
import { PaymentIntent } from '@stripe/stripe-js';

const initialState: {
  applicationLink: string;
  payment?: Payment;
  paymentIntent?: PaymentIntent;
  createPaymentModal: boolean;
  stripeKeys: {
    publishableKey: string;
    secretKey: string;
  };
  selectedPayment?: Payment;
  confirmPaymentModal: boolean;
  paymentVerification?: DPOPaymentVerificationType;
} = {
  applicationLink: '',
  payment: undefined,
  createPaymentModal: false,
  stripeKeys: {
    publishableKey: '',
    secretKey: '',
  },
  paymentIntent: undefined,
  selectedPayment: undefined,
  confirmPaymentModal: false,
  paymentVerification: undefined,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setCreatePaymentModal: (state, action) => {
      state.createPaymentModal = action.payload;
    },
    setPayment: (state, action) => {
      state.payment = action.payload;
    },
    setApplicationLink: (state, action) => {
      state.applicationLink = action.payload;
    },
    setStripeKeys: (state, action) => {
      state.stripeKeys = action.payload;
    },
    setPaymentIntent: (state, action) => {
      state.paymentIntent = action.payload
    },
    setSelectedPayment: (state, action) => {
      state.selectedPayment = action.payload;
    },
    setConfirmPaymentModal: (state, action) => {
      state.confirmPaymentModal = action.payload;
    },
    setPaymentVerification: (state, action) => {
      state.paymentVerification = action.payload;
    },
  },
});

export const {
  setCreatePaymentModal,
  setApplicationLink,
  setPayment,
  setStripeKeys,
  setPaymentIntent,
  setSelectedPayment,
  setConfirmPaymentModal,
  setPaymentVerification,
} = paymentSlice.actions;

export default paymentSlice.reducer;
