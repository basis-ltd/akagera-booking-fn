import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import AdminLayout from '@/containers/AdminLayout';
import { useLazyFetchActivitiesQuery, useLazyFetchBookingActivitiesQuery } from '@/states/apiSlice';
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
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { activitiesList } = useSelector((state: RootState) => state.activity);
  const [activityId, setActivityId] = useState<UUID | null>(null);

  // REACT HOOK FORM
    const { control } = useForm();

    // NAVIGATION
    const navigate = useNavigate();

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
      size: 100,
      page: 0,
      activityId
    });
  }, [activityId, fetchBookingActivities]);

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

    // INITIALIZE FETCH ACTIVITIES QUERY
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
  
    // FETCH ACTIVITIES
    useEffect(() => {
      fetchActivities({ size: 100, page: 0 });
    }, [fetchActivities]);
  
    // HANDLE FETCH ACTIVITIES RESPONSE
    useEffect(() => {
      if (activitiesIsError) {
        const errorResponse =
          (activitiesError as ErrorResponse)?.data?.message ||
          'An error occurred while fetching activities. Refresh page and try again.';
        toast.error(errorResponse);
      } else if (activitiesIsSuccess) {
        dispatch(setActivitiesList(activitiesData?.data?.rows?.map((activity: Activity) => {
          return {
            ...activity,
            description:
              activity?.description !== 'NULL' ? activity?.description : '',
            disclaimer:
              activity?.disclaimer !== 'NULL' ? activity?.disclaimer : '',
          }
        })));
      }
    }, [
      activitiesData,
      activitiesError,
      activitiesIsError,
      activitiesIsSuccess,
      dispatch,
    ]);

  // CUSTOMIZE EVENT PROPAGATION
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
      <main className="w-full flex flex-col gap-5 p-6">
        <section className="grid grid-cols-4 items-start gap-4">
          <Controller
            name="startDate"
            defaultValue={moment().format()}
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
          <Controller name='activityId' control={control} render={({field}) => {
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
          }} />
        </section>
        {(bookingActivitiesIsFetching || activitiesIsFetching) ? (
          <figure className="w-full flex justify-center items-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : bookingActivitiesIsSuccess ? (
          <section className="h-[70vh] w-full flex flex-col gap-4">
            <p className='uppercase text-primary font-semibold'>{bookingActivitiesList?.length} activities scheduled today</p>
            <Calendar
              defaultView="day"
              eventPropGetter={eventStyleGetter}
              localizer={localizer}
              events={bookingActivitiesList?.map(
                (bookingActivity: BookingActivity) => {
                  return {
                    ...bookingActivity,
                    title: bookingActivity?.activity?.name,
                    start: new Date(bookingActivity?.startTime),
                    end: new Date(String(bookingActivity?.endTime)),
                    booking: bookingActivity?.booking,
                  };
                }
              )}
              onSelectEvent={(e) => {
                navigate(`/bookings/${e?.booking?.id}/details`);
              }}
            />
          </section>
        ): (
          <figure className="w-full flex justify-center items-center min-h-[40vh]">
            <p className='text-primary'>No activities scheduled today</p>
          </figure>
        
        )}
      </main>
    </AdminLayout>
  );
};

export default ViewBookingActivites;
