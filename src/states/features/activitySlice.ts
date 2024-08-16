import { createSlice } from '@reduxjs/toolkit';
import { Activity } from '../../types/models/activity.types';

const initialState: {
  activitiesList: Activity[];
  selectedActivity: Activity;
  selectBookingActivityModal: boolean;
  activity?: Activity;
  activityDetailsModal: boolean;
  updateActivityModal: boolean;
  deleteActivityModal: boolean;
  createActivityModal: boolean;
  addBehindTheScenesActivityModal: boolean;
  addBoatTripMorningDayActivityModal: boolean;
  addCampingActivitiesModal: boolean;
  addGameDayDriveActivityModal: boolean;
  addBoatTripPrivateActivityModal: boolean;
} = {
  activitiesList: [],
  selectedActivity: {} as Activity,
  selectBookingActivityModal: false,
  activity: undefined,
  activityDetailsModal: false,
  updateActivityModal: false,
  deleteActivityModal: false,
  createActivityModal: false,
  addBehindTheScenesActivityModal: false,
  addBoatTripMorningDayActivityModal: false,
  addCampingActivitiesModal: false,
  addGameDayDriveActivityModal: false,
  addBoatTripPrivateActivityModal: false,
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
    },
    setDeleteActivityModal: (state, action) => {
      state.deleteActivityModal = action.payload;
    },
    addActivityToList: (state, action) => {
      state.activitiesList.unshift(action.payload);
    },
    removeActivityFromList: (state, action) => {
      state.activitiesList = state.activitiesList.filter(
        (activity) => activity.id !== action.payload
      );
    },
    setCreateActivityModal: (state, action) => {
      state.createActivityModal = action.payload;
    },
    setAddBehindTheScenesActivityModal: (state, action) => {
      state.addBehindTheScenesActivityModal = action.payload;
    },
    setAddBoatTripMorningDayActivityModal: (state, action) => {
      state.addBoatTripMorningDayActivityModal = action.payload;
    },
    setAddCampingActivitiesModal: (state, action) => {
      state.addCampingActivitiesModal = action.payload;
    },
    setAddGameDayDriveActivityModal: (state, action) => {
      state.addGameDayDriveActivityModal = action.payload;
    },
    setAddBoatTripPrivateActivityModal: (state, action) => {
      state.addBoatTripPrivateActivityModal = action.payload;
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
  setDeleteActivityModal,
  removeActivityFromList,
  addActivityToList,
  setCreateActivityModal,
  setAddBehindTheScenesActivityModal,
  setAddBoatTripMorningDayActivityModal,
  setAddCampingActivitiesModal,
  setAddGameDayDriveActivityModal,
  setAddBoatTripPrivateActivityModal
} = activitySlice.actions;

export default activitySlice.reducer;
