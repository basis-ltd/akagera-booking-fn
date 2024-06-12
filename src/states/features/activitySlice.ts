import { createSlice } from '@reduxjs/toolkit';
import { Activity } from '../../types/models/activity.types';

const initialState: {
  activitiesList: Activity[];
  selectedActivity: Activity;
} = {
  activitiesList: [],
  selectedActivity: {} as Activity,
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
  },
});

export const { setActivitiesList, setSelectedActivity } = activitySlice.actions;

export default activitySlice.reducer;
