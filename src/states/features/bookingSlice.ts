import { createSlice } from '@reduxjs/toolkit';
import { Booking } from '../../types/models/booking.types';

const initialState: {
  bookingsList: Booking[];
  selectedBooking: Booking;
  createBookingModal: boolean;
  draftBookingsModal: boolean;
  draftBookingsList: Booking[];
} = {
  bookingsList: [],
  selectedBooking: {} as Booking,
  createBookingModal: false,
  draftBookingsModal: false,
  draftBookingsList: [],
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
    }
  },
});

export const {
  setBookingsList,
  setSelectedBooking,
  setCreateBookingModal,
  setDraftBookingsModal,
  setDraftBookingsList,
} = bookingSlice.actions;

export default bookingSlice.reducer;
