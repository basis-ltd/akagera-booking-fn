import { createSlice } from '@reduxjs/toolkit';
import { Booking } from '../../types/models/booking.types';
import { Payment } from '@/types/models/payment.types';

const initialState: {
  bookingsList: Booking[];
  selectedBooking: Booking;
  createBookingModal: boolean;
  draftBookingsModal: boolean;
  draftBookingsList: Booking[];
  booking: Booking & { totalAmountUsd: number };
  timeSeriesBookings: {
    date: string;
    value: number;
    totalAmountUsd: number;
  }[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  bookingPaymentsList: Payment[];
} = {
  bookingsList: [],
  selectedBooking: {} as Booking,
  createBookingModal: false,
  draftBookingsModal: false,
  draftBookingsList: [],
  booking: { totalAmountUsd: 0 } as Booking & { totalAmountUsd: number },
  timeSeriesBookings: [],
  page: 0,
  size: 10,
  totalCount: 0,
  totalPages: 1,
  bookingPaymentsList: [],
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingsList: (state, action) => {
      state.bookingsList = action.payload;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    setCreateBookingModal: (state, action) => {
      state.createBookingModal = action.payload;
    },
    setDraftBookingsModal: (state, action) => {
      state.draftBookingsModal = action.payload;
    },
    setDraftBookingsList: (state, action) => {
      state.draftBookingsList = action.payload;
    },
    setBooking: (state, action) => {
      state.booking = action.payload;
    },
    setBookingTotalAmountUsd: (state, action) => {
      state.booking.totalAmountUsd = action.payload;
    },
    addBookingTotalAmountUsd: (state, action) => {
      state.booking.totalAmountUsd += Number(action.payload);
    },
    setTimeSeriesBookings: (state, action) => {
      state.timeSeriesBookings = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setBookingPaymentsList: (state, action) => {
      state.bookingPaymentsList = action.payload;
    },
    updateBookingPayment: (state, action) => {
      const bookingPayment = state.bookingPaymentsList.find(
        (payment) => payment.id === action.payload.id
      );
      if (bookingPayment) {
        Object.assign(bookingPayment, action.payload);
      }
    }
  },
});

export const {
  setBookingsList,
  setSelectedBooking,
  setCreateBookingModal,
  setDraftBookingsModal,
  setDraftBookingsList,
  setBooking,
  setBookingTotalAmountUsd,
  addBookingTotalAmountUsd,
  setTimeSeriesBookings,
  setPage,
  setSize,
  setTotalCount,
  setTotalPages,
  setBookingPaymentsList,
  updateBookingPayment,
} = bookingSlice.actions;

export default bookingSlice.reducer;
