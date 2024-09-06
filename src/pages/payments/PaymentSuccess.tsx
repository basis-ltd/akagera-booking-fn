import Loader from '@/components/inputs/Loader';
import PublicLayout from '@/containers/PublicLayout';
import { useHandlePaymentCallbackMutation } from '@/states/apiSlice';
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
    handlePaymentCallback,
    {
      data: updatePaymentData,
      isLoading: updatePaymentIsLoading,
      isSuccess: updatePaymentIsSuccess,
      isError: updatePaymentIsError,
      error: updatePaymentError,
    },
  ] = useHandlePaymentCallbackMutation();

  // HANDLE UPDATE PAYMENT
  useEffect(() => {
    if (queryParams?.CompanyRef) {
      handlePaymentCallback({
        status: 'PAID',
        TransID: queryParams?.TransID,
        CompanyRef: queryParams?.CompanyRef,
        CCDapproval: queryParams?.CCDapproval,
      });
    }
  }, [handlePaymentCallback, queryParams]);

  useEffect(() => {
    if (submitBookingIsSuccess) {
      navigate(`/bookings/${updatePaymentData?.data?.bookingId}/success`);
    }
  }, [navigate, submitBookingIsSuccess, updatePaymentData?.data?.bookingId]);

  // HANDLE UPDATE PAYMENT SUCCESS RESPONSE
  useEffect(() => {
    if (updatePaymentIsSuccess) {
      toast.success('Payment received successfully');
      dispatch(
        submitBookingThunk({
          id: updatePaymentData?.data?.bookingId,
          status: 'cash_received',
          totalAmountUsd: updatePaymentData?.data?.amount,
          totalAmountRwf: updatePaymentData?.data?.amount * 1343,
        })
      );
    } else if (updatePaymentIsError) {
      toast.error(
        (updatePaymentError as ErrorResponse)?.data?.message ||
          'Error while updating payment. Refresh the page and try again'
      );
    }
  }, [
    updatePaymentData,
    dispatch,
    navigate,
    updatePaymentError,
    updatePaymentIsError,
    updatePaymentIsSuccess,
  ]);

  return (
    <PublicLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-5 p-6 min-h-[80vh] items-center justify-center">
        {(updatePaymentIsLoading) && (
          <figure className='w-full flex flex-col gap-3 justify-center items-center'>
            <Loader className="text-primary" />
            <h3 className='text-primary'>Processing payment...</h3>
          </figure>
        )}
        {(submitBookingIsLoading) && (
          <figure className='w-full flex flex-col gap-3 justify-center items-center'>
            <Loader className="text-primary" />
            <h3 className='text-primary'>Submitting booking...</h3>
          </figure>
        )}
      </main>
    </PublicLayout>
  );
};

export default PaymentSuccess;
