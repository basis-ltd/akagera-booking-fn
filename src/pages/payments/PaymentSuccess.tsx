import Loader from '@/components/inputs/Loader';
import AdminLayout from '@/containers/AdminLayout';
import { useUpdatePaymentMutation } from '@/states/apiSlice';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentSuccess = () => {
  // STATE VARIABLES
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

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

  // HANDLE UPDATE PAYMENT SUCCESS RESPONSE
  useEffect(() => {
    if (updatePaymentIsSuccess) {
      toast.success('Payment received successfully');
      navigate(`/bookings/${updatePaymentData?.data?.bookingId}/preview`);
    } else if (updatePaymentIsError) {
      toast.error(
        (updatePaymentError as ErrorResponse)?.data?.message ||
          'Error while updating payment. Refresh the page and try again'
      );
    }
  }, [
    navigate,
    updatePaymentData?.data?.bookingId,
    updatePaymentError,
    updatePaymentIsError,
    updatePaymentIsSuccess,
  ]);

  return (
    <AdminLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-5 p-6 min-h-[80vh] items-center justify-center">
        {updatePaymentIsLoading && <Loader className="text-primary" />}
      </main>
    </AdminLayout>
  );
};

export default PaymentSuccess;
