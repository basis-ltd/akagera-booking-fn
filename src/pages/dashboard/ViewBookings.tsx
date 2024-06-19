import Loader from '@/components/inputs/Loader';
import AdminLayout from '@/containers/AdminLayout';
import {
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingsQuery,
} from '@/states/apiSlice';
import { setBookingActivitiesList } from '@/states/features/bookingActivitySlice';
import { setBookingsList } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import moment from 'moment';
import { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewBookings = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingsList } = useSelector((state: RootState) => state.booking);
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );

  // INITIALIZE LOCALIZER
  const localizer = momentLocalizer(moment);

  // INITIALIZE FETCH BOOKING ACTIVITIES
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      error: bookingActivitiesError,
      isLoading: bookingActivitiesIsLoading,
      isError: bookingActivitiesIsError,
      isSuccess: bookingActivitiesIsSuccess,
    },
  ] = useLazyFetchBookingActivitiesQuery();

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    fetchBookingActivities({
      take: 100,
      skip: 0,
    });
  }, [fetchBookingActivities]);

  // INITIALIZE FETCH BOOKINGS QUERY
  const [
    fetchBookings,
    {
      data: bookingsData,
      error: bookingsError,
      isLoading: bookingsIsLoading,
      isError: bookingsIsError,
      isSuccess: bookingsIsSuccess,
    },
  ] = useLazyFetchBookingsQuery();

  // FETCH BOOKINGS
  useEffect(() => {
    fetchBookings({
      take: 100,
      skip: 0,
      startDate: moment().startOf('day').toISOString(),
      endDate: moment().endOf('day').toISOString(),
    });
  }, [fetchBookings]);

  // HANDLE FETCH BOOKINGS RESPONSE
  useEffect(() => {
    if (bookingsIsError) {
      if ((bookingsError as ErrorResponse)?.status === 500) {
        toast.error('Failed to fetch bookings. Please try again later.');
      } else {
        toast.error((bookingsError as ErrorResponse)?.data?.message);
      }
    } else if (bookingsIsSuccess) {
      dispatch(setBookingsList(bookingsData?.data?.rows));
    }
  }, [
    bookingsData,
    bookingsError,
    bookingsIsError,
    bookingsIsSuccess,
    dispatch,
  ]);

  // HANDLE FETCH BOOKING ACTIVITIES RESPONSE
  useEffect(() => {
    if (bookingActivitiesIsError) {
      if ((bookingActivitiesError as ErrorResponse)?.status === 500) {
        toast.error(
          'Failed to fetch booking activities. Please try again later.'
        );
      } else {
        toast.error((bookingActivitiesError as ErrorResponse)?.data?.message);
      }
    } else if (bookingActivitiesIsSuccess) {
      dispatch(setBookingActivitiesList(bookingActivitiesData?.data?.rows));
    }
  }, [
    bookingActivitiesData,
    bookingActivitiesError,
    bookingActivitiesIsError,
    bookingActivitiesIsSuccess,
    dispatch,
  ]);

  return (
    <AdminLayout>
      <main className="w-full flex flex-col gap-6 p-6">
        <h1 className="text-black">
          Bookings scheduled for {moment().format('dddd, MMMM Do YYYY')}
        </h1>
        {bookingActivitiesIsLoading ? (
          <figure className="w-full flex justify-center items-center">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4">
            <Calendar
              localizer={localizer}
              events={bookingActivitiesList?.map(
                (activity: BookingActivity, index: number) => {
                  return {
                    id: index,
                    start: activity?.startTime,
                    end:
                      activity?.endTime ||
                      moment(activity?.startTime).add(1, 'hour').toISOString(),
                  };
                }
              )}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </section>
        )}
      </main>
    </AdminLayout>
  );
};

export default ViewBookings;
