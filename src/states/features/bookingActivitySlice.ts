import { BookingActivity } from '@/types/models/bookingActivity.types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import apiSlice from '../apiSlice';
import { toast } from 'react-toastify';

const initialState: {
  bookingActivitiesList: BookingActivity[];
  selectedBookingActivity?: BookingActivity;
  deleteBookingActivityModal: boolean;
  existingBookingActivitiesList: BookingActivity[];
  existingBookingActivitiesIsFetching: boolean;
  existingBookingActivitiesIsSuccess: boolean;
  createBookingActivityIsLoading: boolean;
  createBookingActivityIsError: boolean;
  createBookingActivityIsSuccess: boolean;
} = {
  bookingActivitiesList: [],
  selectedBookingActivity: undefined,
  deleteBookingActivityModal: false,
  existingBookingActivitiesList: [],
  existingBookingActivitiesIsFetching: false,
  createBookingActivityIsLoading: false,
  createBookingActivityIsError: false,
  createBookingActivityIsSuccess: false,
  existingBookingActivitiesIsSuccess: false,
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

    return response.data.data?.rows;
  }
);

// CREATE BOOKING ACTIVITY THUNK
export const createBookingActivityThunk = createAsyncThunk<
  BookingActivity,
  {
    bookingId: UUID;
    activityId: UUID;
    defaultRate?: number;
    numberOfAdults?: number;
    numberOfChildren?: number;
    numberOfSeats?: number;
    startTime?: Date | string;
    endTime?: Date | string;
  },
  {
    dispatch: AppDispatch;
  }
>(
  'bookingActivity/createBookingActivity',
  async (
    {
      bookingId,
      activityId,
      numberOfAdults,
      numberOfChildren,
      numberOfSeats,
      startTime,
      defaultRate,
      endTime,
    },
    { dispatch }
  ) => {
    try {
      const response = await dispatch(
        apiSlice.endpoints.createBookingActivity.initiate({
          bookingId,
          activityId,
          numberOfAdults: numberOfAdults || 0,
          numberOfChildren: numberOfChildren || 0,
          numberOfSeats,
          startTime,
          defaultRate,
          endTime,
        })
      );
      dispatch(addBookingActivity(response.data?.data));
      toast.success('Booking activity created successfully.');
      return response.data;
    } catch (error) {
      toast.error(
        'Failed to create booking activity. Please refresh and try again.'
      );
    }
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
    setCreateBookingActivityIsLoading: (state, action) => {
      state.createBookingActivityIsLoading = action.payload;
    },
    setCreateBookingActivityIsError: (state, action) => {
      state.createBookingActivityIsError = action.payload;
    },
    setCreateBookingActivityIsSuccess: (state, action) => {
      state.createBookingActivityIsSuccess = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookingActivitiesThunk.pending, (state) => {
      state.existingBookingActivitiesIsFetching = true;
      state.existingBookingActivitiesIsSuccess = false;
    });
    builder.addCase(fetchBookingActivitiesThunk.fulfilled, (state) => {
      state.existingBookingActivitiesIsFetching = false;
      state.existingBookingActivitiesIsSuccess = true;
    });
    builder.addCase(fetchBookingActivitiesThunk.rejected, (state) => {
      state.existingBookingActivitiesIsFetching = false;
      state.existingBookingActivitiesIsSuccess = false;
    });
    builder.addCase(createBookingActivityThunk.pending, (state) => {
      state.createBookingActivityIsLoading = true;
      state.createBookingActivityIsError = false;
      state.createBookingActivityIsSuccess = false;
    });
    builder.addCase(createBookingActivityThunk.fulfilled, (state) => {
      state.createBookingActivityIsLoading = false;
      state.createBookingActivityIsSuccess = true;
    });
    builder.addCase(createBookingActivityThunk.rejected, (state) => {
      state.createBookingActivityIsLoading = false;
      state.createBookingActivityIsSuccess = false;
      state.createBookingActivityIsError = true;
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
  setCreateBookingActivityIsLoading,
  setCreateBookingActivityIsError,
  setCreateBookingActivityIsSuccess,
} = bookingActivitySlice.actions;
export default bookingActivitySlice.reducer;