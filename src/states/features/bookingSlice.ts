import { createSlice } from '@reduxjs/toolkit';
import { Booking } from '../../types/models/booking.types';

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
  }[];
} = {
  bookingsList: [],
  selectedBooking: {} as Booking,
  createBookingModal: false,
  draftBookingsModal: false,
  draftBookingsList: [],
  booking: { totalAmountUsd: 0 } as Booking & { totalAmountUsd: number },
  timeSeriesBookings: [],
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
} = bookingSlice.actions;

export default bookingSlice.reducer;
