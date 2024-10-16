import {
  useCreatePaymentMutation,
  useSubmitBookingMutation,
} from '@/states/apiSlice';
import { RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useSubmitAndPayLater = () => {
  // STATE VARIABLES
  const { booking } = useSelector((state: RootState) => state.booking);

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE SUBMIT BOOKING THUNK
  const [
    submitBookingThunk,
    {
      isLoading: submitBookingIsLoading,
      isError: submitBookingIsError,
      error: submitBookingError,
      isSuccess: submitBookingIsSuccess,
      reset: submitBookingReset,
    },
  ] = useSubmitBookingMutation();

  // INITIALIZE CREATE PAYMENT MUTATION
  const [
    createPayment,
    {
      isLoading: createPaymentIsLoading,
      isError: createPaymentIsError,
      error: createPaymentError,
      isSuccess: createPaymentIsSuccess,
    },
  ] = useCreatePaymentMutation();

  function submitAndPayLater(booking: Booking) {
    createPayment({
      bookingId: booking?.id,
      amount: Number(booking?.totalAmountRwf),
      currency: 'RWF',
      email: booking?.email,
    });
  }

  useEffect(() => {
    if (createPaymentIsSuccess) {
      submitBookingThunk({
        id: booking?.id,
        status: 'pending',
        totalAmountRwf: booking?.totalAmountRwf,
        totalAmountUsd: booking?.totalAmountUsd,
      });
    }
  }, [
    booking?.id,
    booking?.totalAmountRwf,
    booking?.totalAmountUsd,
    createPaymentIsSuccess,
    submitBookingThunk,
  ]);

  useEffect(() => {
    if (submitBookingIsSuccess) {
      submitBookingReset();
      navigate(`/bookings/${booking?.id}/success`);
    } else if (submitBookingIsError) {
      const errorMessage =
        (submitBookingError as ErrorResponse)?.data?.message ||
        'An error occurred while submitting the booking';
      toast.error(errorMessage);
    }
  }, [
    submitBookingIsSuccess,
    submitBookingIsError,
    submitBookingError,
    navigate,
    booking?.id,
    submitBookingReset,
  ]);

  return {
    submitBookingThunk,
    submitBookingIsLoading,
    submitBookingIsError,
    submitBookingError,
    submitBookingIsSuccess,
    createPayment,
    createPaymentIsLoading,
    createPaymentIsError,
    createPaymentError,
    createPaymentIsSuccess,
    submitAndPayLater,
  };
};
