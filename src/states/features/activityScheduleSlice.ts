import {
  ActivitySchedule,
  SeatsAdjustment,
} from '@/types/models/activitySchedule.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import apiSlice from '../apiSlice';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import { formatDate } from '@/helpers/strings.helper';

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
  createSeatsAdjustmentsModal: boolean;
  seatsAdjustmentsList: SeatsAdjustment[];
  manageSeatsAdjustmentsModal: boolean;
  deleteSeatsAdjustmentModal: boolean;
  selectedSeatsAdjustment?: SeatsAdjustment;
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
  createSeatsAdjustmentsModal: false,
  seatsAdjustmentsList: [],
  manageSeatsAdjustmentsModal: false,
  deleteSeatsAdjustmentModal: false,
  selectedSeatsAdjustment: undefined,
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
        date: formatDate(date),
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
    setCreateSeatsAdjustmentsModal: (state, action) => {
      state.createSeatsAdjustmentsModal = action.payload;
    },
    setSeatsAdjustmentsList: (state, action) => {
      state.seatsAdjustmentsList = action.payload;
    },
    addToSeatsAdjustmentsList: (state, action) => {
      state.seatsAdjustmentsList.unshift(action.payload);
    },
    removeFromSeatsAdjustmentsList: (state, action) => {
      state.seatsAdjustmentsList = state.seatsAdjustmentsList.filter(
        (seatsAdjustment) => seatsAdjustment.id !== action.payload
      );
    },
    setManageSeatsAdjustmentsModal: (state, action) => {
      state.manageSeatsAdjustmentsModal = action.payload;
    },
    setDeleteSeatsAdjustmentModal: (state, action) => {
      state.deleteSeatsAdjustmentModal = action.payload;
    },
    setSelectedSeatsAdjustment: (state, action) => {
      state.selectedSeatsAdjustment = action.payload;
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
  setRemainingSeats,
  setCreateSeatsAdjustmentsModal,
  setSeatsAdjustmentsList,
  addToSeatsAdjustmentsList,
  removeFromSeatsAdjustmentsList,
  setManageSeatsAdjustmentsModal,
  setDeleteSeatsAdjustmentModal,
  setSelectedSeatsAdjustment,
} = activityScheduleSlice.actions;

export default activityScheduleSlice.reducer;
