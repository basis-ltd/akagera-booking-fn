import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import ActivityCard from '@/containers/ActivityCard';
import {
  useLazyFetchActivitiesQuery,
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingPeopleQuery,
} from '@/states/apiSlice';
import { setActivityRatesList } from '@/states/features/activityRateSlice';
import { setActivitiesList } from '@/states/features/activitySlice';
import { setSelectedService } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Activity } from '@/types/models/activity.types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setBookingActivitiesList } from '@/states/features/bookingActivitySlice';
import { setBookingPeopleList } from '@/states/features/bookingPeopleSlice';

const CreateBookingActivitiesActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const { activitiesList, selectBookingActivityModal } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);

  // INITIALIZE FETCH BOOKING PEOPLE
  const [
    fetchBookingPeople,
    {
      data: bookingPeopleData,
      error: bookingPeopleError,
      isSuccess: bookingPeopleIsSuccess,
      isError: bookingPeopleIsError,
      isFetching: bookingPeopleIsFetching,
    },
  ] = useLazyFetchBookingPeopleQuery();

  // FETCH BOOKING PEOPLE
  useEffect(() => {
    if (booking) {
      fetchBookingPeople({ bookingId: booking?.id, size: 100, page: 0 });
    }
  }, [booking, fetchBookingPeople]);

  // HANDLE FETCH BOOKING PEOPLE RESPONSE
  useEffect(() => {
    if (bookingPeopleIsError) {
      if ((bookingPeopleError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking people. Please try again later.'
        );
      } else {
        toast.error((bookingPeopleError as ErrorResponse).data.message);
      }
    } else if (bookingPeopleIsSuccess) {
      dispatch(setBookingPeopleList(bookingPeopleData?.data?.rows));
    }
  }, [
    bookingPeopleIsSuccess,
    bookingPeopleIsError,
    bookingPeopleData,
    bookingPeopleError,
    dispatch,
  ]);

  // INITIALIZE FETCH ACTIVITIES QUERY
  const [
    fetchActivities,
    {
      data: activitiesData,
      error: activitiesError,
      isSuccess: activitiesIsSuccess,
      isError: activitiesIsError,
      isFetching: activitiesIsFetching,
    },
  ] = useLazyFetchActivitiesQuery();

  // INITIALIZE FETCHING BOOKING ACTIVITIES QUERY
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      error: bookingActivitiesError,
      isSuccess: bookingActivitiesIsSuccess,
      isError: bookingActivitiesIsError,
      isFetching: bookingActivitiesIsFetching,
    },
  ] = useLazyFetchBookingActivitiesQuery();

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    if (booking && !selectBookingActivityModal) {
      fetchBookingActivities({ bookingId: booking?.id, size: 100, page: 0 });
    }
  }, [booking, fetchBookingActivities, selectBookingActivityModal]);

  // HANDLE FETCH BOOKING ACTIVITIES RESPONSE
  useEffect(() => {
    if (bookingActivitiesIsError) {
      if ((bookingActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking activities. Please try again later.'
        );
      } else {
        toast.error((bookingActivitiesError as ErrorResponse).data.message);
      }
    } else if (bookingActivitiesIsSuccess) {
      dispatch(setBookingActivitiesList(bookingActivitiesData?.data?.rows));
    }
  }, [
    bookingActivitiesIsSuccess,
    bookingActivitiesIsError,
    bookingActivitiesData,
    bookingActivitiesError,
    dispatch,
  ]);

  // FETCH ACTIVITIES
  useEffect(() => {
    if (selectedService) {
      fetchActivities({ serviceId: selectedService.id, size: 100, page: 0 });
    }
  }, [fetchActivities, selectedService]);

  // HANDLE FETCH ACTIVITIES RESPONSE
  useEffect(() => {
    if (activitiesIsError) {
      if ((activitiesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching activities. Please try again later.'
        );
      } else {
        toast.error((activitiesError as ErrorResponse).data.message);
      }
    } else if (activitiesIsSuccess) {
      dispatch(setActivitiesList(activitiesData?.data?.rows));
      dispatch(
        setActivityRatesList(
          activitiesData?.data?.rows?.flatMap(
            (activity: Activity) => activity.activityRates
          )
        )
      );
    }
  }, [
    activitiesIsSuccess,
    activitiesIsError,
    activitiesData,
    activitiesError,
    dispatch,
  ]);

  return (
    <section className="w-full flex flex-col gap-5 py-6">
      {activitiesIsFetching ||
      bookingActivitiesIsFetching ||
      bookingPeopleIsFetching ? (
        <figure className="w-full min-h-[40vh] flex items-center justify-center">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <menu className="w-full grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
          {activitiesIsSuccess &&
            activitiesList?.length > 0 &&
            activitiesList.map((activity) => {
              return <ActivityCard key={activity?.id} activity={activity} />;
            })}
        </menu>
      )}
      <menu className="flex items-center gap-3 justify-between w-full">
        <Button
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setSelectedService(
                servicesList.indexOf(selectedService) - 1 >= 0 &&
                  servicesList[servicesList.indexOf(selectedService) - 1]
              )
            );
          }}
          disabled={servicesList.indexOf(selectedService) - 1 < 0}
        >
          Back
        </Button>
        <Button
          primary
          disabled={
            servicesList.indexOf(selectedService) + 1 >= servicesList.length
          }
          onClick={(e) => {
            e.preventDefault();
            dispatch(
              setSelectedService(
                servicesList.indexOf(selectedService) + 1 <
                  servicesList.length &&
                  servicesList[servicesList.indexOf(selectedService) + 1]
              )
            );
          }}
        >
          Next
        </Button>
      </menu>
    </section>
  );
};

export default CreateBookingActivitiesActivity;
