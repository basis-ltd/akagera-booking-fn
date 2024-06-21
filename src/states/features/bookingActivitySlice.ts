import { BookingActivity } from '@/types/models/bookingActivity.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  bookingActivitiesList: BookingActivity[];
  selectedBookingActivity: BookingActivity;
  deleteBookingActivityModal: boolean;
} = {
  bookingActivitiesList: [],
  selectedBookingActivity: {} as BookingActivity,
  deleteBookingActivityModal: false,
};

const bookingActivitySlice = createSlice({
  name: 'bookingActivity',
  initialState,
  reducers: {
    setBookingActivitiesList: (state, action) => {
      state.bookingActivitiesList = action.payload;
    },
    setSelectedBookingActivity: (state, action) => {
      state.selectedBookingActivity = action.payload;
    },
    addBookingActivity: (state, action) => {
      state.bookingActivitiesList.unshift(action.payload);
    },
    removeBookingActivity: (state, action) => {
      state.bookingActivitiesList = state.bookingActivitiesList.filter(
        (bookingActivity) => bookingActivity.id !== action.payload
      );
    },
    setDeleteBookingActivityModal: (state, action) => {
      state.deleteBookingActivityModal = action.payload;
    },
  },
});

export const {
  setBookingActivitiesList,
  setSelectedBookingActivity,
  addBookingActivity,
  removeBookingActivity,
  setDeleteBookingActivityModal,
} = bookingActivitySlice.actions;

export default bookingActivitySlice.reducer;
