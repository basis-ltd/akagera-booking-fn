import { createSlice } from '@reduxjs/toolkit';
import { Activity } from '../../types/models/activity.types';

const initialState: {
  activitiesList: Activity[];
  selectedActivity: Activity;
  selectBookingActivityModal: boolean;
  activity?: Activity;
  activityDetailsModal: boolean;
  updateActivityModal: boolean;
} = {
  activitiesList: [],
  selectedActivity: {} as Activity,
  selectBookingActivityModal: false,
  activity: undefined,
  activityDetailsModal: false,
  updateActivityModal: false,
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
    setActivity: (state, action) => {
      state.activity = action.payload;
    },
    setActivityDetailsModal: (state, action) => {
      state.activityDetailsModal = action.payload;
    },
    setUpdateActivityModal: (state, action) => {
      state.updateActivityModal = action.payload;
    }
  },
});

export const {
  setActivitiesList,
  setSelectedActivity,
  setSelectBookingActivityModal,
  setActivity,
  setActivityDetailsModal,
  setUpdateActivityModal,
} = activitySlice.actions;

export default activitySlice.reducer;
