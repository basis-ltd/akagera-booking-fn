import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import AdminLayout from '@/containers/AdminLayout';
import {
  useLazyFetchActivitiesQuery,
  useLazyFetchBookingActivitiesQuery,
} from '@/states/apiSlice';
import { setActivitiesList } from '@/states/features/activitySlice';
import { setBookingActivitiesList } from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { Activity } from '@/types/models/activity.types';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { UUID } from 'crypto';
import moment from 'moment';
import { getLuminance } from 'polished';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewBookingActivites = () => {
  const dispatch: AppDispatch = useDispatch();
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { activitiesList } = useSelector((state: RootState) => state.activity);
  const [activityId, setActivityId] = useState<UUID | null>(null);
  const [startTime, setStartTime] = useState<Date | string | null>(
    moment().format('YYYY-MM-DD')
  );

  const { control } = useForm();
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);

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

  useEffect(() => {
    fetchBookingActivities({
      size: 100,
      page: 0,
      activityId,
      startTime,
    });
  }, [activityId, fetchBookingActivities, startTime]);

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

  const [
    fetchActivities,
    {
      data: activitiesData,
      error: activitiesError,
      isError: activitiesIsError,
      isFetching: activitiesIsFetching,
      isSuccess: activitiesIsSuccess,
    },
  ] = useLazyFetchActivitiesQuery();

  useEffect(() => {
    fetchActivities({ size: 100, page: 0 });
  }, [fetchActivities]);

  useEffect(() => {
    if (activitiesIsError) {
      const errorResponse =
        (activitiesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching activities. Refresh page and try again.';
      toast.error(errorResponse);
    } else if (activitiesIsSuccess) {
      dispatch(
        setActivitiesList(
          activitiesData?.data?.rows?.map((activity: Activity) => {
            return {
              ...activity,
              description:
                activity?.description !== 'NULL' ? activity?.description : '',
              disclaimer:
                activity?.disclaimer !== 'NULL' ? activity?.disclaimer : '',
            };
          })
        )
      );
    }
  }, [
    activitiesData,
    activitiesError,
    activitiesIsError,
    activitiesIsSuccess,
    dispatch,
  ]);

  const eventStyleGetter = (event: BookingActivity) => {
    let backgroundColor = '#036124';
    switch (event?.booking?.status) {
      case 'pending':
      case 'pending_contact':
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
      size: '13px',
      fontSize: '13px',
    };
    return {
      style: style,
    };
  };

  return (
    <AdminLayout>
      <main className="w-full flex flex-col gap-5 p-4 md:p-6">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          <Controller
            name="startDate"
            defaultValue={moment().format('YYYY-MM-DD')}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    className="w-full"
                    type="date"
                    placeholder="Select day"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setStartTime(moment(String(e)).format('YYYY-MM-DD'));
                    }}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange(null);
                      setStartTime(null);
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
            name="activityId"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    {...field}
                    placeholder="Filter by activity"
                    options={activitiesList?.map((activity) => ({
                      label: activity?.name,
                      value: activity?.id,
                    }))}
                    onChange={(e) => {
                      setActivityId(e as UUID);
                      field.onChange(e);
                    }}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange({
                        target: {
                          value: null,
                        },
                      });
                      setActivityId(null);
                    }}
                    className="px-1 text-[12px] text-primary"
                    to={'#'}
                  >
                    Reset activity
                  </Link>
                </label>
              );
            }}
          />
        </section>
        {bookingActivitiesIsFetching || activitiesIsFetching ? (
          <figure className="w-full flex justify-center items-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : bookingActivitiesIsSuccess ? (
          <section className="h-[65vh] w-full flex flex-col gap-4 overflow-hidden">
            <p className="uppercase text-primary font-semibold">
              {bookingActivitiesList?.length} activities scheduled{' '}
              {startTime ? moment(startTime).format('dddd, MMMM Do YYYY') : ''}
            </p>
            <div className="h-full w-full">
              <Calendar
                defaultView="week"
                eventPropGetter={eventStyleGetter}
                localizer={localizer}
                events={bookingActivitiesList
                  ?.filter((bookingActivity: BookingActivity) =>
                    ['pending', 'confirmed', 'payment_received'].includes(
                      bookingActivity?.booking?.status
                    )
                  )
                  ?.map((bookingActivity: BookingActivity) => {
                    return {
                      ...bookingActivity,
                      title: bookingActivity?.activity?.name,
                      start: new Date(bookingActivity?.startTime),
                      end: new Date(String(bookingActivity?.endTime)),
                      booking: bookingActivity?.booking,
                    };
                  })}
                onSelectEvent={(e) => {
                  navigate(`/bookings/${e?.booking?.id}/details`);
                }}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </section>
        ) : (
          <figure className="w-full flex justify-center items-center min-h-[40vh]">
            <p className="text-primary">No activities scheduled today</p>
          </figure>
        )}
      </main>
    </AdminLayout>
  );
};

export default ViewBookingActivites;
