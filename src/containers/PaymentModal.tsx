import Modal from '@/components/modals/Modal';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import Button from '@/components/inputs/Button';
import { useState } from 'react';
import { AppDispatch, RootState } from '@/states/store';
import { setCreatePaymentModal } from '@/states/features/paymentSlice';
import { useForm } from 'react-hook-form';
import Loader from '@/components/inputs/Loader';
import { formatCurrency } from '@/helpers/strings.helper';

const CheckoutForm = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { paymentIntent, applicationLink, payment } = useSelector(
    (state: RootState) => state.payment
  );

  // REACT HOOK FORM
  const { handleSubmit } = useForm();

  // LOADING VARIABLE
  const [loading, setLoading] = useState(false);

  // DEFINE STRIPE METHODS
  const stripe = useStripe();
  const elements = useElements();

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (elements == null || !stripe) {
        return;
      }

      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message);
      }
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: String(paymentIntent?.client_secret),
        confirmParams: {
          return_url: `${applicationLink}/payments/${payment?.id}/success`,
        },
      });

      setLoading(false);

      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error('Error while creating payment. Please try again');
      dispatch(setCreatePaymentModal(false));
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <PaymentElement />
      <Button submit primary>
        {loading ? <Loader /> : `Pay ${formatCurrency(payment?.amount)}`}
      </Button>
    </form>
  );
};

const PaymentModal = () => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { stripeKeys, payment, createPaymentModal } = useSelector(
    (state: RootState) => state.payment
  );

  const options = {
    mode: 'payment',
    amount: payment?.amount || 4500,
    currency: payment?.currency?.toLowerCase() || 'usd',
  };

  const stripePromise = loadStripe(stripeKeys?.publishableKey) || '';

  return (
    <Elements stripe={stripePromise} options={options as StripeElementsOptions}>
      <Modal
        isOpen={createPaymentModal}
        onClose={() => {
          dispatch(setCreatePaymentModal(false));
        }}
        heading='Complete payment'
      >
        <CheckoutForm />
      </Modal>
    </Elements>
  );
};

export default PaymentModal;
