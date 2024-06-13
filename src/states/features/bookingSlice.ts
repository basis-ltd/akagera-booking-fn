import { createSlice } from '@reduxjs/toolkit';
import { Booking } from '../../types/models/booking.types';

const initialState: {
  bookingsList: Booking[];
  selectedBooking: Booking;
  createBookingModal: boolean;
} = {
  bookingsList: [],
  selectedBooking: {} as Booking,
  createBookingModal: false,
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
  },
});

export const { setBookingsList, setSelectedBooking, setCreateBookingModal } =
  bookingSlice.actions;

export default bookingSlice.reducer;
