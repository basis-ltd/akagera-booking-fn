import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import PublicLayout from '@/containers/PublicLayout';
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
      isFetching: bookingDetailsIsFetching,
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
    <PublicLayout>
      <main className="w-full flex flex-col gap-5 min-h-[90vh] items-center justify-center">
        {bookingDetailsIsFetching ? (
          <figure className="flex w-full min-h-[50vh] justify-center items-center">
            <Loader className="text-primary" />
          </figure>
        ) : (
          bookingDetailsIsSuccess && (
            <section className="flex flex-col items-center h-full justify-center w-full">
              <h1 className="text-3xl font-bold text-center mt-6">
                Booking Successful 🎉
              </h1>
              <p className="mt-4 max-w-[70%] text-center mx-auto">
                <p>Your booking has been successfully created.</p>
                <p>
                  You will receive additional communication on{' '}
                  <span className="font-bold">{booking?.email}</span> or{' '}
                  <span className="font-bold">{booking?.phone}</span>
                </p>
                including the booking details. <br /> <br /> Use the Booking
                Reference ID{' '}
                <span className="font-bold">{booking?.referenceId}</span> to
                track and manage your booking.
              </p>
            </section>
          )
        )}
        <menu className="w-full flex items-center justify-center">
          <Button route={'/'} primary>
            Continue
          </Button>
        </menu>
      </main>
    </PublicLayout>
  );
};

export default BookingSuccess;
