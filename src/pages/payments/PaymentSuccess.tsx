import Loader from '@/components/inputs/Loader';
import PublicLayout from '@/containers/PublicLayout';
import { useUpdatePaymentMutation } from '@/states/apiSlice';
import { submitBookingThunk } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const { submitBookingIsSuccess, submitBookingIsLoading } =
    useSelector((state: RootState) => state.booking);

  // NAVIGATION
  const navigate = useNavigate();
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INTIIALIZE UPDATE PAYMENT MUTATION
  const [
    updatePayment,
    {
      data: updatePaymentData,
      error: updatePaymentError,
      isLoading: updatePaymentIsLoading,
      isSuccess: updatePaymentIsSuccess,
      isError: updatePaymentIsError,
    },
  ] = useUpdatePaymentMutation();

  // HANDLE UPDATE PAYMENT
  useEffect(() => {
    if (queryParams?.payment_intent) {
      updatePayment({
        paymentIntentId: queryParams?.payment_intent,
        status: 'PAID',
      });
    }
  }, [queryParams, updatePayment]);

  useEffect(() => {
    if (submitBookingIsSuccess) {
      navigate(`/bookings/${updatePaymentData?.data?.bookingId}/success`);
    }
  }, [
    dispatch,
    navigate,
    submitBookingIsSuccess,
    updatePaymentData?.data?.bookingId,
  ]);

  // HANDLE UPDATE PAYMENT SUCCESS RESPONSE
  useEffect(() => {
    if (updatePaymentIsSuccess) {
      toast.success('Payment received successfully');
      dispatch(
        submitBookingThunk({
          id: updatePaymentData?.data?.bookingId,
          status: 'pending',
        })
      );
    } else if (updatePaymentIsError) {
      toast.error(
        (updatePaymentError as ErrorResponse)?.data?.message ||
          'Error while updating payment. Refresh the page and try again'
      );
    }
  }, [
    updatePaymentData?.data?.bookingId,
    dispatch,
    navigate,
    updatePaymentError,
    updatePaymentIsError,
    updatePaymentIsSuccess,
  ]);

  return (
    <PublicLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-5 p-6 min-h-[80vh] items-center justify-center">
        {(updatePaymentIsLoading || submitBookingIsLoading) && (
          <Loader className="text-primary" />
        )}
      </main>
    </PublicLayout>
  );
};

export default PaymentSuccess;
