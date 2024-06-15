import { ActivityRate } from '@/types/models/activityRate.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  activityRatesList: ActivityRate[];
  selectedActivityRate: ActivityRate;
} = {
  activityRatesList: [],
  selectedActivityRate: {} as ActivityRate,
};

const activityRateSlice = createSlice({
  name: 'activityRate',
  initialState,
  reducers: {
    setActivityRatesList: (state, action) => {
      state.activityRatesList = action.payload;
    },
    setSelectedActivityRate: (state, action) => {
      state.selectedActivityRate = action.payload;
    },
  },
});

export const { setActivityRatesList, setSelectedActivityRate } =
  activityRateSlice.actions;

export default activityRateSlice.reducer;
