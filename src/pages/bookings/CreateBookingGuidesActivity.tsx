import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import ActivityCard from '@/containers/ActivityCard';
import { useLazyFetchActivitiesQuery } from '@/states/apiSlice';
import { setActivityRatesList } from '@/states/features/activityRateSlice';
import { setActivitiesList } from '@/states/features/activitySlice';
import { setSelectedService } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Activity } from '@/types/models/activity.types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateBookingGuidesActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedService, servicesList } = useSelector(
    (state: RootState) => state.service
  );
  const { activitiesList, selectBookingActivityModal } = useSelector((state: RootState) => state.activity);
  const { booking } = useSelector((state: RootState) => state.booking);

  // NAVIGATION
  const navigate = useNavigate();

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

  // FETCH ACTIVITIES
  useEffect(() => {
    !selectBookingActivityModal && fetchActivities({ serviceId: selectedService?.id });
  }, [fetchActivities, selectedService, selectBookingActivityModal]);

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
    <section className="flex flex-col gap-6 w-full">
      {activitiesIsFetching ? (
        <figure className="flex items-center justify-center w-full min-h-[40vh]">
          <Loader className='text-primary' />
        </figure>
      ) : (
        <menu className="w-full grid grid-cols-2 gap-6">
          {activitiesIsSuccess &&
            activitiesList?.length > 0 &&
            activitiesList.map((activity) => {
              return <ActivityCard activity={activity} />;
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
            navigate(`/bookings/${booking?.id}/preview`);
          }}
        >
          Next
        </Button>
      </menu>
    </section>
  );
};

export default CreateBookingGuidesActivity;
