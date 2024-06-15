import { useEffect, useState } from 'react';
import {
  useLazyFetchServicesQuery,
} from '../../states/apiSlice';
import { ErrorResponse, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedService, setServicesList } from '../../states/features/serviceSlice';
import { FieldValues, useForm } from 'react-hook-form';
import ServiceCard from '../../containers/ServiceCard';
import Loader from '../../components/inputs/Loader';
import queryString from 'query-string';
import { Service } from '@/types/models/service.types';
import CreateBookingEntryActivity from './CreateBookingEntryActivity';
import CreateBookingActivitiesActivity from './CreateBookingActivitiesActivity';

const CreateBookingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const [referenceId, setReferenceId] = useState<string>('');

  // REACT HOOK FORM
  const { handleSubmit } = useForm();

  // NAVIGATION
  const { search } = useLocation();

  // PARSE URL QUERY PARAMS
  useEffect(() => {
    const parsed = queryString.parse(search);
    setReferenceId(String(parsed?.referenceId));
  }, [search]);

  console.log(referenceId);

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
      dispatch(setSelectedService(servicesData?.data?.rows[0] as Service));
    }
  }, [
    servicesIsSuccess,
    servicesIsError,
    servicesData,
    servicesError,
    dispatch,
  ]);

  return (
    <main className="w-full flex flex-col gap-6 p-4 max-h-[90vh]">
      <h1 className="text-primary font-medium uppercase text-lg text-center">
        Create booking schedule
      </h1>
      {servicesIsLoading && (
        <figure className="flex items-center gap-4 w-full min-h-[40vh]">
          <Loader />
        </figure>
      )}
      {servicesIsSuccess && servicesList?.length > 0 && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-[80%] mx-auto">
          <fieldset className="flex flex-col gap-3">
            <section className="flex flex-col gap-5">
              <h1 className="text-lg text-center font-medium">
                Select a service to view available activities, schedules, and
                their respective prices.
              </h1>
              <menu className="flex items-center w-full gap-4">
                {servicesList.map((service) => {
                  return (
                    selectedService.id === service.id && (
                      <ServiceCard service={service} key={service.id} />
                    )
                  );
                })}
                
              </menu>
              {servicesList.indexOf(selectedService) === 0 && (
              <CreateBookingEntryActivity />
            )}
            {servicesList.indexOf(selectedService) === 1 && (
              <CreateBookingActivitiesActivity />
            )}
            </section>
          </fieldset>
        </form>
      )}
    </main>
  );
};

export default CreateBookingActivities;
