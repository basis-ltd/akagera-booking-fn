import { BookingActivityPerson } from '@/types/models/bookingActivityPerson.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  selectedBookingActivityPeople: BookingActivityPerson[];
  selectedBookingActivityPerson: BookingActivityPerson[];
  bookingActivityPeopleList: BookingActivityPerson[];
} = {
  selectedBookingActivityPeople: [],
  selectedBookingActivityPerson: [],
    bookingActivityPeopleList: [],
};

const bookingActivityPersonSlice = createSlice({
  name: 'bookingActivityPerson',
  initialState,
  reducers: {
    setSelectedBookingActivityPeople: (state, action) => {
      state.selectedBookingActivityPeople = action.payload;
    },
    setSelectedBookingActivityPerson: (state, action) => {
      state.selectedBookingActivityPerson = action.payload;
    },
    setBookingActivityPeopleList: (state, action) => {
      state.bookingActivityPeopleList = action.payload;
    },
    addSelectedBookingActivityPerson: (state, action) => {
      state.selectedBookingActivityPeople.push(action.payload);
    },
    removeSelectedBookingActivityPerson: (state, action) => {
      state.selectedBookingActivityPeople =
        state.selectedBookingActivityPeople.filter(
          (bookingActivityPerson) => bookingActivityPerson.id !== action.payload
        );
    },
    addBookingActivityPerson: (state, action) => {
        state.bookingActivityPeopleList.push(action.payload);
        },
    removeBookingActivityPerson: (state, action) => {
        state.bookingActivityPeopleList = state.bookingActivityPeopleList.filter(
            (bookingActivityPerson) => bookingActivityPerson.id !== action.payload
        );
    }
  },
});

export const {
    setSelectedBookingActivityPeople,
    setSelectedBookingActivityPerson,
    setBookingActivityPeopleList,
    addSelectedBookingActivityPerson,
    removeSelectedBookingActivityPerson,
    addBookingActivityPerson,
    removeBookingActivityPerson,
} = bookingActivityPersonSlice.actions;

export default bookingActivityPersonSlice.reducer;
