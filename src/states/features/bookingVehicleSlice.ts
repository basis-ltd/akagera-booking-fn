import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  bookingVehiclesList: BookingVehicle[];
  selectedBookingVehicle: BookingVehicle;
  createBookingVehicleModal: boolean;
  deleteBookingVehicleModal: boolean;
} = {
  bookingVehiclesList: [],
  selectedBookingVehicle: {} as BookingVehicle,
  createBookingVehicleModal: false,
  deleteBookingVehicleModal: false,
};

const bookingVehicleSlice = createSlice({
  name: 'bookingVehicle',
  initialState,
  reducers: {
    setBookingVehiclesList: (state, action) => {
      state.bookingVehiclesList = action.payload;
    },
    setSelectedBookingVehicle: (state, action) => {
      state.selectedBookingVehicle = action.payload;
    },
    addBookingVehicle: (state, action) => {
      state.bookingVehiclesList.unshift(action.payload);
    },
    removeBookingVehicle: (state, action) => {
      state.bookingVehiclesList = state.bookingVehiclesList.filter(
        (vehicle) => vehicle.id !== action.payload.id
      );
    },
    setCreateBookingVehicleModal: (state, action) => {
      state.createBookingVehicleModal = action.payload;
    },
    setDeleteBookingVehicleModal: (state, action) => {
      state.deleteBookingVehicleModal = action.payload;
    }
  },
});

export const {
  setBookingVehiclesList,
  setSelectedBookingVehicle,
  addBookingVehicle,
  removeBookingVehicle,
  setCreateBookingVehicleModal,
  setDeleteBookingVehicleModal,
} = bookingVehicleSlice.actions;

export default bookingVehicleSlice.reducer;
