import { BookingActivity } from '@/types/models/bookingActivity.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import apiSlice from '../apiSlice';

const initialState: {
  bookingActivitiesList: BookingActivity[];
  selectedBookingActivity?: BookingActivity;
  deleteBookingActivityModal: boolean;
  existingBookingActivitiesList: BookingActivity[];
  existingBookingActivitiesIsFetching: boolean;
} = {
  bookingActivitiesList: [],
  selectedBookingActivity: undefined,
  deleteBookingActivityModal: false,
  existingBookingActivitiesList: [],
  existingBookingActivitiesIsFetching: false,
};

// FETCH BOOKING ACTIVITIES THUNK
export const fetchBookingActivitiesThunk = createAsyncThunk<
  BookingActivity[],
  {
    bookingId: UUID;
    size: number;
    page: number;
    activityId?: UUID;
  },
  {
    dispatch: AppDispatch;
  }
>(
  'bookingActivity/fetchBookingActivities',
  async ({ bookingId, size, page, activityId }, { dispatch }) => {
    const response = await dispatch(
      apiSlice.endpoints.fetchBookingActivities.initiate({
        bookingId,
        size,
        page,
        activityId,
      })
    );
    dispatch(setExistingBookingActivitiesList(response.data?.data?.rows));
    return response.data;
  }
);

const bookingActivitySlice = createSlice({
  name: 'bookingActivity',
  initialState,
  reducers: {
    setBookingActivitiesList: (state, action) => {
      state.bookingActivitiesList = action.payload;
    },
    setSelectedBookingActivity: (state, action) => {
      state.selectedBookingActivity = action.payload;
    },
    addBookingActivity: (state, action) => {
      state.bookingActivitiesList.unshift(action.payload);
    },
    removeBookingActivity: (state, action) => {
      state.bookingActivitiesList = state.bookingActivitiesList.filter(
        (bookingActivity) => bookingActivity.id !== action.payload
      );
    },
    setDeleteBookingActivityModal: (state, action) => {
      state.deleteBookingActivityModal = action.payload;
    },
    setExistingBookingActivitiesList: (state, action) => {
      state.existingBookingActivitiesList = action.payload;
    },
    removeExistingBookingActivitiesList: (state, action) => {
      state.existingBookingActivitiesList =
        state.existingBookingActivitiesList.filter(
          (bookingActivity) => bookingActivity.id !== action.payload
        );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookingActivitiesThunk.pending, (state) => {
      state.existingBookingActivitiesIsFetching = true;
    });
    builder.addCase(fetchBookingActivitiesThunk.fulfilled, (state) => {
      state.existingBookingActivitiesIsFetching = false;
    });
    builder.addCase(fetchBookingActivitiesThunk.rejected, (state) => {
      state.existingBookingActivitiesIsFetching = false;
    });
  },
});

export const {
  setBookingActivitiesList,
  setSelectedBookingActivity,
  addBookingActivity,
  removeBookingActivity,
  setDeleteBookingActivityModal,
  setExistingBookingActivitiesList,
  removeExistingBookingActivitiesList,
} = bookingActivitySlice.actions;

export default bookingActivitySlice.reducer;
