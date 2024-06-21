import { BookingPerson } from '@/types/models/bookingPerson.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  bookingPeopleList: BookingPerson[];
  selectedBookingPerson: BookingPerson;
  createBookingPersonModal: boolean;
  deleteBookingPersonModal: boolean;
  selectedBookingPeople: BookingPerson[];
} = {
  bookingPeopleList: [],
  selectedBookingPerson: {} as BookingPerson,
  createBookingPersonModal: false,
  deleteBookingPersonModal: false,
  selectedBookingPeople: [],
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
    setDeleteBookingPersonModal: (state, action) => {
      state.deleteBookingPersonModal = action.payload;
    },
    removeBookingPerson: (state, action) => {
      state.bookingPeopleList = state.bookingPeopleList.filter(
        (bookingPerson) => bookingPerson.id !== action.payload.id
      );
    },
    setSelectedBookingPeople: (state, action) => {
      state.selectedBookingPeople = action.payload;
    },
    addSelectedBookingPerson: (state, action) => {
      state.selectedBookingPeople.push(action.payload);
    },
    removeSelectedBookingPerson: (state, action) => {
      state.selectedBookingPeople = state.selectedBookingPeople.filter(
        (bookingPerson) => bookingPerson.id !== action.payload.id
      );
    }
  },
});

export const {
  setBookingPeopleList,
  setSelectedBookingPerson,
  setCreateBookingPersonModal,
  addBookingPerson,
  setDeleteBookingPersonModal,
  removeBookingPerson,
  setSelectedBookingPeople,
  addSelectedBookingPerson,
  removeSelectedBookingPerson,
} = bookingPeopleSlice.actions;

export default bookingPeopleSlice.reducer;
