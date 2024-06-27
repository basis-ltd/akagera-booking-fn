import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { bookingStatus } from '@/constants/bookings.constants';
import AdminLayout from '@/containers/AdminLayout';
import { capitalizeString, formatDate } from '@/helpers/strings';
import {
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingsQuery,
} from '@/states/apiSlice';
import { setBookingActivitiesList } from '@/states/features/bookingActivitySlice';
import { setBookingsList } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getLuminance } from 'polished';

const ViewBookings = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingsList } = useSelector((state: RootState) => state.booking);
  const [createdBy, setCreatedBy] = useState<string | null>(null);

  // REACT HOOK FORM
  const { control, watch } = useForm();

  // INITIALIZE LOCALIZER
  const localizer = momentLocalizer(moment);

  // INITIALIZE FETCH BOOKING ACTIVITIES
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      error: bookingActivitiesError,
      isFetching: bookingActivitiesIsFetching,
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
      isFetching: bookingsIsFetching,
      isError: bookingsIsError,
      isSuccess: bookingsIsSuccess,
    },
  ] = useLazyFetchBookingsQuery();

  // FETCH BOOKINGS
  useEffect(() => {
    fetchBookings({
      take: 100,
      skip: 0,
      startDate:
        watch('startDate') && moment(watch('startDate')).format('YYYY-MM-DD'),
      status: watch('status'),
      type: 'booking',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBookings, watch('startDate'), watch('status'), createdBy]);

  // HANDLE FETCH BOOKINGS RESPONSE
  useEffect(() => {
    if (bookingsIsError) {
      dispatch(setBookingsList([]));
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

  // CUSTOMIZE EVENT PROPAGATION
  const eventStyleGetter = (event: Booking) => {
    let backgroundColor = '#036124';
    switch (event?.status) {
      case 'pending':
        backgroundColor = '#F59E0B';
        break;
      case 'approved':
        backgroundColor = '#036124';
        break;
      case 'cancelled':
        backgroundColor = '#DC2626';
        break;
      case 'in_progress':
        backgroundColor = '#808080';
        break;
      default:
        break;
    }
    const luminance = getLuminance(backgroundColor);
    const color = luminance > 0.5 ? 'black' : 'white';
    const style = {
      backgroundColor,
      borderRadius: '5px',
      padding: '5px',
      shadow: '0px 0px 5px 0px rgba(0,0,0,0.75)',
      color,
      border: '0px',
      display: 'block',
    };
    return {
      style: style,
    };
  };

  return (
    <AdminLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-6 p-6">
        <h1 className="text-primary text-center uppercase font-semibold text-lg">
          Bookings scheduled for{' '}
          {watch('startDate')
            ? formatDate(watch('startDate'))
            : moment().format('dddd, MMMM Do YYYY')}
        </h1>
        {bookingsIsSuccess && (
          <section className="grid grid-cols-4 items-start gap-4">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      className="w-fit"
                      type="date"
                      placeholder="Select day"
                      {...field}
                    />
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        field.onChange(null);
                      }}
                      className="px-1 text-[12px] text-primary"
                      to={'#'}
                    >
                      Reset date
                    </Link>
                  </label>
                );
              }}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Select
                      {...field}
                      placeholder="Status"
                      options={Object.values(bookingStatus).map((status) => ({
                        label: capitalizeString(status),
                        value: status,
                      }))}
                    />
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        field.onChange({
                          target: {
                            value: null,
                          },
                        });
                      }}
                      className="px-1 text-[12px] text-primary"
                      to={'#'}
                    >
                      Reset status
                    </Link>
                  </label>
                );
              }}
            />
            <Controller
              control={control}
              name="createdBy"
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      placeholder="Email or phone"
                      suffixIcon={faSearch}
                      suffixIconPrimary
                      suffixIconHandler={(e) => {
                        e.preventDefault();
                        setCreatedBy(field.value);
                      }}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (!e.target.value) {
                          setCreatedBy(null);
                        }
                      }}
                    />
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        field.value = null;
                      }}
                      className="px-1 text-[12px] text-primary"
                      to={'#'}
                    >
                      Clear
                    </Link>
                  </label>
                );
              }}
            />
          </section>
        )}
        {bookingActivitiesIsFetching || bookingsIsFetching ? (
          <figure className="w-full flex justify-center items-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4">
            <Calendar
              localizer={localizer}
              eventPropGetter={(event) =>
                eventStyleGetter(event as unknown as Booking)
              }
              defaultView="month"
              className="bg-white rounded-lg shadow-md p-4 text-[12px]"
              events={bookingsList
                ?.filter((booking) => booking?.status !== 'in_progress')
                ?.map((booking: Booking, index: number) => {
                  return {
                    ...booking,
                    id: index,
                    title: `${booking?.name} (${capitalizeString(
                      booking?.status
                    )})`,
                    start: new Date(booking?.startDate),
                    end: booking?.endDate ? new Date(booking?.endDate) : null,
                  };
                })}
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
