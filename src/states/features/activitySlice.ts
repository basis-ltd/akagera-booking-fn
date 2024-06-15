import { createSlice } from '@reduxjs/toolkit';
import { Activity } from '../../types/models/activity.types';

const initialState: {
  activitiesList: Activity[];
  selectedActivity: Activity;
  selectBookingActivityModal: boolean;
} = {
  activitiesList: [],
  selectedActivity: {} as Activity,
  selectBookingActivityModal: false,
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivitiesList: (state, action) => {
      state.activitiesList = action.payload;
    },
    setSelectedActivity: (state, action) => {
      state.selectedActivity = action.payload;
    },
    setSelectBookingActivityModal: (state, action) => {
      state.selectBookingActivityModal = action.payload;
    },
  },
});

export const {
  setActivitiesList,
  setSelectedActivity,
  setSelectBookingActivityModal,
} = activitySlice.actions;

export default activitySlice.reducer;
