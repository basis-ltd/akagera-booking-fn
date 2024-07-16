import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  activityScheduleDetailsModal: boolean;
  selectedActivitySchedule?: ActivitySchedule;
  createActivityScheduleModal: boolean;
  deleteActivityScheduleModal: boolean;
  activitySchedulesList: ActivitySchedule[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
} = {
  activityScheduleDetailsModal: false,
  selectedActivitySchedule: undefined,
  createActivityScheduleModal: false,
  deleteActivityScheduleModal: false,
  activitySchedulesList: [],
  page: 0,
  size: 10,
  totalCount: 0,
  totalPages: 1,
};

const activityScheduleSlice = createSlice({
  name: 'activitySchedule',
  initialState,
  reducers: {
    setActivityScheduleDetailsModal: (state, action) => {
      state.activityScheduleDetailsModal = action.payload;
    },
    setSelectedActivitySchedule: (state, action) => {
      state.selectedActivitySchedule = action.payload;
    },
    setCreateActivityScheduleModal: (state, action) => {
      state.createActivityScheduleModal = action.payload;
    },
    setDeleteActivityScheduleModal: (state, action) => {
      state.deleteActivityScheduleModal = action.payload;
    },
    setActivitySchedulesList: (state, action) => {
      state.activitySchedulesList = action.payload;
    },
    addToActivityScheduleList: (state, action) => {
      state.activitySchedulesList.unshift(action.payload);
    },
    removeFromActivityScheduleList: (state, action) => {
      state.activitySchedulesList = state.activitySchedulesList.filter(
        (activitySchedule) => activitySchedule.id !== action.payload
      );
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
  },
});

export const {
  setActivityScheduleDetailsModal,
  setSelectedActivitySchedule,
  setCreateActivityScheduleModal,
  setDeleteActivityScheduleModal,
  setActivitySchedulesList,
  addToActivityScheduleList,
  removeFromActivityScheduleList,
  setSize,
  setPage,
  setTotalCount,
  setTotalPages,
} = activityScheduleSlice.actions;

export default activityScheduleSlice.reducer;
