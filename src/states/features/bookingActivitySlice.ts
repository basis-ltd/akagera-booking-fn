import { BookingActivity } from '@/types/models/bookingActivity.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  bookingActivitiesList: BookingActivity[];
  selectedBookingActivity?: BookingActivity;
  deleteBookingActivityModal: boolean;
  existingBookingActivitiesList: BookingActivity[];
} = {
  bookingActivitiesList: [],
  selectedBookingActivity: undefined,
  deleteBookingActivityModal: false,
  existingBookingActivitiesList: [],
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
    setExistingBookingActivitiesList: (state, action) => {
      state.existingBookingActivitiesList = action.payload;
    },
    removeExistingBookingActivitiesList: (state, action) => {
      state.existingBookingActivitiesList =
        state.existingBookingActivitiesList.filter(
          (bookingActivity) => bookingActivity.id !== action.payload
        );
    },
  },
});

export const {
  setBookingActivitiesList,
  setSelectedBookingActivity,
  addBookingActivity,
  removeBookingActivity,
  setDeleteBookingActivityModal,
  setExistingBookingActivitiesList,
  removeExistingBookingActivitiesList,
} = bookingActivitySlice.actions;

export default bookingActivitySlice.reducer;
