import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Booking } from '../../types/models/booking.types';
import { Payment } from '@/types/models/payment.types';
import apiSlice from '../apiSlice';
import { UUID } from 'crypto';
import { AppDispatch } from '../store';
import { toast } from 'react-toastify';

const initialState: {
  bookingsList: Booking[];
  selectedBooking: Booking;
  createBookingModal: boolean;
  draftBookingsModal: boolean;
  draftBookingsList: Booking[];
  booking: Booking & { totalAmountUsd: number };
  timeSeriesBookings: {
    date: string;
    value: number;
    totalAmountUsd: number;
  }[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
  bookingPaymentsList: Payment[];
  bookingAmount: number;
  bookingAmountIsFetching: boolean;
  bookingAmountIsSuccess: boolean;
  submitBookingIsLoading: boolean;
  submitBookingIsSuccess: boolean;
  bookingIsFetching: boolean;
  bookingIsSuccess: boolean;
  bookingIsError: boolean;
  cancellationPolicyModal: boolean;
} = {
  bookingsList: [],
  selectedBooking: {} as Booking,
  createBookingModal: false,
  draftBookingsModal: false,
  draftBookingsList: [],
  booking: { totalAmountUsd: 0 } as Booking & { totalAmountUsd: number },
  timeSeriesBookings: [],
  page: 0,
  size: 10,
  totalCount: 0,
  totalPages: 1,
  bookingPaymentsList: [],
  bookingAmount: 0,
  bookingAmountIsFetching: false,
  bookingAmountIsSuccess: false,
  submitBookingIsLoading: false,
  submitBookingIsSuccess: false,
  bookingIsFetching: false,
  bookingIsSuccess: false,
  bookingIsError: false,
  cancellationPolicyModal: false,
};

// GET BOOKING AMOUNT THUNK
export const getBookingAmountThunk = createAsyncThunk<
  number,
  { id: UUID },
  { dispatch: AppDispatch }
>('booking/getBookingAmount', async ({ id }, { dispatch }) => {
  const response = await dispatch(
    apiSlice.endpoints.getBookingAmount.initiate({ id })
  );
  return response?.data?.data;
});

// SUBMIT BOOKING THUNK
export const submitBookingThunk = createAsyncThunk<
  Booking,
  {
    id: UUID;
    status: string;
    totalAmountUsd?: number;
    totalAmountRwf?: number;
  },
  { dispatch: AppDispatch }
>(
  'booking/submitBooking',
  async ({ id, status, totalAmountUsd, totalAmountRwf }, { dispatch }) => {
    const response = await dispatch(
      apiSlice.endpoints.submitBooking.initiate({
        id,
        status,
        totalAmountUsd,
        totalAmountRwf,
      })
    );
    return response?.data?.data;
  }
);

// GET BOOKING DETAILS THUNK
export const getBookingDetailsThunk = createAsyncThunk<
  Booking,
  { id: UUID },
  { dispatch: AppDispatch }
>('booking/getBookingDetails', async ({ id }, { dispatch }) => {
  try {
    const response = await dispatch(
      apiSlice.endpoints.getBookingDetails.initiate({ id })
    );
    if (response?.data?.data === null) {
      toast.error('Booking not found.');
      return
    }
    dispatch(setBooking(response?.data?.data));
    return response?.data?.data;
  } catch (error) {
    toast.error('An error occured while fetching booking details.');
  }
});

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingsList: (state, action) => {
      state.bookingsList = action.payload;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    setCreateBookingModal: (state, action) => {
      state.createBookingModal = action.payload;
    },
    setDraftBookingsModal: (state, action) => {
      state.draftBookingsModal = action.payload;
    },
    setDraftBookingsList: (state, action) => {
      state.draftBookingsList = action.payload;
    },
    setBooking: (state, action) => {
      state.booking = action.payload;
    },
    setBookingTotalAmountUsd: (state, action) => {
      state.booking.totalAmountUsd = action.payload;
    },
    addBookingTotalAmountUsd: (state, action) => {
      state.booking.totalAmountUsd += Number(action.payload);
    },
    setTimeSeriesBookings: (state, action) => {
      state.timeSeriesBookings = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setBookingPaymentsList: (state, action) => {
      state.bookingPaymentsList = action.payload;
    },
    updateBookingPayment: (state, action) => {
      const bookingPayment = state.bookingPaymentsList.find(
        (payment) => payment.id === action.payload.id
      );
      if (bookingPayment) {
        Object.assign(bookingPayment, action.payload);
      }
    },
    setCancellationPolicyModal: (state, action) => {
      state.cancellationPolicyModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getBookingAmountThunk.pending, (state) => {
      state.bookingAmountIsFetching = true;
    });
    builder.addCase(getBookingAmountThunk.fulfilled, (state, action) => {
      state.bookingAmountIsFetching = false;
      state.bookingAmountIsSuccess = true;
      state.bookingAmount = action.payload;
    });
    builder.addCase(getBookingAmountThunk.rejected, (state) => {
      state.bookingAmountIsFetching = false;
      state.bookingAmountIsSuccess = false;
    });
    builder.addCase(submitBookingThunk.pending, (state) => {
      state.submitBookingIsLoading = true;
      state.submitBookingIsSuccess = false;
    });
    builder.addCase(submitBookingThunk.fulfilled, (state) => {
      state.submitBookingIsLoading = false;
      state.submitBookingIsSuccess = true;
    });
    builder.addCase(submitBookingThunk.rejected, (state) => {
      state.submitBookingIsLoading = false;
      state.submitBookingIsSuccess = false;
    });
    builder.addCase(getBookingDetailsThunk.pending, (state) => {
      state.bookingIsFetching = true;
      state.bookingIsSuccess = false;
      state.bookingIsError = false;
    });
    builder.addCase(getBookingDetailsThunk.fulfilled, (state) => {
      state.bookingIsFetching = false;
      state.bookingIsSuccess = true;
    });
    builder.addCase(getBookingDetailsThunk.rejected, (state) => {
      state.bookingIsFetching = false;
      state.bookingIsSuccess = false;
      state.bookingIsError = true;
    });
  },
});

export const {
  setBookingsList,
  setSelectedBooking,
  setCreateBookingModal,
  setDraftBookingsModal,
  setDraftBookingsList,
  setBooking,
  setBookingTotalAmountUsd,
  addBookingTotalAmountUsd,
  setTimeSeriesBookings,
  setPage,
  setSize,
  setTotalCount,
  setTotalPages,
  setBookingPaymentsList,
  updateBookingPayment,
  setCancellationPolicyModal
} = bookingSlice.actions;

export default bookingSlice.reducer;
