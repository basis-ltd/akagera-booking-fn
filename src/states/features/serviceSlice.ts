import { createSlice } from '@reduxjs/toolkit';
import { Service } from '../../types/models/service.types';

const initialState: {
  servicesList: Service[];
  selectedService: Service;
} = {
  servicesList: [],
  selectedService: {} as Service,
};

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setServicesList: (state, action) => {
      state.servicesList = action.payload;
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
  },
});

export const { setServicesList, setSelectedService } = serviceSlice.actions;

export default serviceSlice.reducer;
