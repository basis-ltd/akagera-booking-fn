import { useEffect } from 'react';
import {
  useLazyFetchActivitiesQuery,
  useLazyFetchServicesQuery,
} from '../../states/apiSlice';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setServicesList } from '../../states/features/serviceSlice';
import { FieldValues, useForm } from 'react-hook-form';
import ServiceCard from '../../containers/ServiceCard';
import Loader from '../../components/inputs/Loader';
import { setActivitiesList } from '../../states/features/activitySlice';
import ActivityCard from '../../containers/ActivityCard';

const CreateBooking = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const { activitiesList } = useSelector((state: RootState) => state.activity);

  // REACT HOOK FORM
  const { handleSubmit } = useForm();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    console.log(data);
  };

  // INITIALIZE FETCH SERVICES QUERY
  const [
    fetchServices,
    {
      data: servicesData,
      error: servicesError,
      isLoading: servicesIsLoading,
      isSuccess: servicesIsSuccess,
      isError: servicesIsError,
    },
  ] = useLazyFetchServicesQuery();

  // INITIALIZE FETCH ACTIVITIES QUERY
  const [
    fetchActivities,
    {
      data: activitiesData,
      error: activitiesError,
      isLoading: activitiesIsLoading,
      isSuccess: activitiesIsSuccess,
      isError: activitiesIsError,
    },
  ] = useLazyFetchActivitiesQuery();

  // FETCH ACTIVITIES
  useEffect(() => {
    if (selectedService) {
      fetchActivities({ serviceId: selectedService.id, take: 100, skip: 0 });
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
    }
  }, [
    activitiesIsSuccess,
    activitiesIsError,
    activitiesData,
    activitiesError,
    dispatch,
  ]);

  // FETCH SERVICES
  useEffect(() => {
    fetchServices({ take: 100, skip: 0 });
  }, [fetchServices]);

  // HANDLE FETCH SERVICES RESPONSE
  useEffect(() => {
    if (servicesIsError) {
      if ((servicesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching services. Please try again later.'
        );
      } else {
        toast.error((servicesError as ErrorResponse).data.message);
      }
    } else if (servicesIsSuccess) {
      dispatch(setServicesList(servicesData?.data?.rows));
    }
  }, [
    servicesIsSuccess,
    servicesIsError,
    servicesData,
    servicesError,
    dispatch,
  ]);

  console.log(servicesList);

  return (
    <section className="w-full flex flex-col gap-6 p-8">
      <h1 className="text-primary font-medium uppercase text-lg text-center">
        Create booking schedule
      </h1>
      {servicesIsLoading && (
        <figure className="flex items-center gap-4 w-full min-h-[40vh]">
          <Loader />
        </figure>
      )}
      {servicesIsSuccess && servicesList?.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <section className="flex flex-col gap-5 w-full">
            <h1 className="text-lg text-center font-medium">
              Select a service to view available activities, schedules, and
              their respective prices.
            </h1>
            <menu className="flex items-center w-full gap-4">
              {servicesList.map((service) => {
                return <ServiceCard service={service} key={service.id} />;
              })}
            </menu>
            {activitiesIsLoading && (
              <figure className="flex items-center gap-4 w-full min-h-[40vh]">
                <Loader />
              </figure>
            )}
            {activitiesIsSuccess && activitiesList?.length > 0 && (
              <section className="flex flex-col gap-5 w-full my-4">
                <h1 className="text-lg text-center font-medium">
                  Select an activity to add to your booking schedule.
                </h1>
                <menu className="flex items-center w-full gap-4 flex-wrap">
                  {activitiesList.map((activity) => {
                    return (
                      <ActivityCard activity={activity} key={activity.id} />
                    );
                  })}
                </menu>
              </section>
            )}
          </section>
        </form>
      )}
    </section>
  );
};

export default CreateBooking;
