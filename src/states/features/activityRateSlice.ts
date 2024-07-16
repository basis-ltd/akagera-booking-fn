import { ActivityRate } from '@/types/models/activityRate.types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: {
  activityRatesList: ActivityRate[];
  selectedActivityRate: ActivityRate;
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  createActivityRateModal: boolean;
  deleteActivityRateModal: boolean;
  updateActivityRateModal: boolean;
} = {
  activityRatesList: [],
  selectedActivityRate: {} as ActivityRate,
  page: 0,
  size: 10,
  totalCount: 0,
  totalPages: 1,
  createActivityRateModal: false,
  deleteActivityRateModal: false,
  updateActivityRateModal: false,
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
    addToActivityRatesList: (state, action) => {
      state.activityRatesList.unshift(action.payload);
    },
    removeFromActivityRatesList: (state, action) => {
      state.activityRatesList = state.activityRatesList.filter(
        (activityRate) => activityRate.id !== action.payload
      );
    },
    setCreateActivityRateModal: (state, action) => {
      state.createActivityRateModal = action.payload;
    },
    setDeleteActivityRateModal: (state, action) => {
      state.deleteActivityRateModal = action.payload;
    },
    setUpdateActivityRateModal: (state, action) => {
      state.updateActivityRateModal = action.payload;
    },
  },
});

export const {
  setActivityRatesList,
  setSelectedActivityRate,
  setSize,
  setPage,
  setTotalCount,
  setTotalPages,
  addToActivityRatesList,
  removeFromActivityRatesList,
  setCreateActivityRateModal,
  setDeleteActivityRateModal,
  setUpdateActivityRateModal,
} = activityRateSlice.actions;

export default activityRateSlice.reducer;
