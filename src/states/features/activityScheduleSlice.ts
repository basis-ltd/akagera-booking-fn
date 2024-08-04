import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiSlice from '../apiSlice';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';

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
  remainingSeatsIsFetching: boolean;
  remainingSeats: number | boolean;
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
  remainingSeatsIsFetching: false,
  remainingSeats: 0,
};

// CALCULATE REMAINING SEATS THUNK
export const calculateRemainingSeatsThunk = createAsyncThunk<
  number,
  { id: UUID; date: string | Date },
  { dispatch: AppDispatch }
>(
  'activitySchedule/calculateRemainingSeats',
  async ({ id, date }, { dispatch }) => {
    const response = await dispatch(
      apiSlice.endpoints.getRemainingSeats.initiate({
        id,
        date,
      })
    );
    dispatch(setRemainingSeats(response.data?.data));
    return response.data;
  }
);

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
    setRemainingSeats: (state, action) => {
      state.remainingSeats = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(calculateRemainingSeatsThunk.pending, (state) => {
      state.remainingSeatsIsFetching = true;
    });
    builder.addCase(calculateRemainingSeatsThunk.fulfilled, (state) => {
      state.remainingSeatsIsFetching = false;
    });
    builder.addCase(calculateRemainingSeatsThunk.rejected, (state) => {
      state.remainingSeatsIsFetching = false;
    });
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
  setRemainingSeats
} = activityScheduleSlice.actions;

export default activityScheduleSlice.reducer;
