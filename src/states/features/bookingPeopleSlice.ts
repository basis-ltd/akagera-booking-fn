import { BookingPerson } from '@/types/models/bookingPerson.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  bookingPeopleList: BookingPerson[];
  selectedBookingPerson: BookingPerson;
  createBookingPersonModal: boolean;
} = {
  bookingPeopleList: [],
  selectedBookingPerson: {} as BookingPerson,
  createBookingPersonModal: false,
};

const bookingPeopleSlice = createSlice({
  name: 'bookingPeople',
  initialState,
  reducers: {
    setBookingPeopleList: (state, action) => {
      state.bookingPeopleList = action.payload;
    },
    setSelectedBookingPerson: (state, action) => {
      state.selectedBookingPerson = action.payload;
    },
    setCreateBookingPersonModal: (state, action) => {
      state.createBookingPersonModal = action.payload;
    },
    addBookingPerson: (state, action) => {
      state.bookingPeopleList.unshift(action.payload);
    },
  },
});

export const {
  setBookingPeopleList,
  setSelectedBookingPerson,
  setCreateBookingPersonModal,
  addBookingPerson,
} = bookingPeopleSlice.actions;

export default bookingPeopleSlice.reducer;
