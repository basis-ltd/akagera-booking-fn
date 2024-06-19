import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import { useLazyGetBookingDetailsQuery } from '@/states/apiSlice';
import { setBooking } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingSuccess = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { booking } = useSelector((state: RootState) => state.booking);

  // NAVIGATION
  const { id } = useParams();
  const navigate = useNavigate();

  // INITIALIZE GET BOOKING DETAILS QUERY
  const [
    getBookingDetails,
    {
      data: bookingDetailsData,
      error: bookingDetailsError,
      isSuccess: bookingDetailsIsSuccess,
      isError: bookingDetailsIsError,
      isLoading: bookingDetailsIsLoading,
    },
  ] = useLazyGetBookingDetailsQuery();

  // FETCH BOOKING DETAILS
  useEffect(() => {
    getBookingDetails({ id });
  }, [getBookingDetails, id]);

  // HANDLE GET BOOKING DETAILS RESPONSE
  useEffect(() => {
    if (bookingDetailsIsError) {
      if ((bookingDetailsError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking details. Please try again later.'
        );
        navigate('/');
      } else {
        toast.error((bookingDetailsError as ErrorResponse).data.message);
        navigate('/');
      }
    } else if (bookingDetailsIsSuccess) {
      dispatch(setBooking(bookingDetailsData?.data));
    }
  }, [
    bookingDetailsIsSuccess,
    bookingDetailsIsError,
    bookingDetailsData,
    bookingDetailsError,
    dispatch,
    navigate,
  ]);

  return (
    <main className='w-full flex flex-col gap-5'>
      {bookingDetailsIsLoading ? (
        <figure className="flex w-full min-h-[50vh] justify-center items-center">
          <Loader />
        </figure>
      ) : (
        bookingDetailsIsSuccess && (
          <section className="flex flex-col items-center">
            <h1 className="text-3xl font-bold text-center mt-6">
              Booking Successful 🎉
            </h1>
            <p className="mt-4 max-w-[70%] text-center mx-auto">
              Your booking has been successfully created. <br />
              <br /> You will receive additional communication on{' '}
              <span className="font-bold">{booking?.createdBy}</span> including
              the booking details. Use the Booking Reference ID{' '}
              <span className="font-bold">{booking?.referenceId}</span> to track
              and manage your booking.
            </p>
          </section>
        )
      )}
      <menu className="w-full flex items-center justify-center">
        <Button route={'/'} primary>Continue</Button>
      </menu>
    </main>
  );
};

export default BookingSuccess;