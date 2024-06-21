import { useEffect, useState } from 'react';
import {
  useLazyFetchServicesQuery,
  useLazyGetBookingDetailsQuery,
} from '../../states/apiSlice';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedService,
  setServicesList,
} from '../../states/features/serviceSlice';
import { FieldValues, useForm } from 'react-hook-form';
import ServiceCard from '../../containers/ServiceCard';
import Loader from '../../components/inputs/Loader';
import queryString from 'query-string';
import { Service } from '@/types/models/service.types';
import CreateBookingEntryActivity from './CreateBookingEntryActivity';
import CreateBookingActivitiesActivity from './CreateBookingActivitiesActivity';
import { setBooking } from '@/states/features/bookingSlice';
import { formatDate } from '@/helpers/strings';
import CreateBookingGuidesActivity from './CreateBookingGuidesActivity';
import SelectBookingActivity from './SelectBookingActivity';
import PublicLayout from '@/containers/PublicLayout';

const CreateBookingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const [referenceId, setReferenceId] = useState<string>('');

  // REACT HOOK FORM
  const { handleSubmit } = useForm();

  // NAVIGATION
  const { search } = useLocation();
  const navigate = useNavigate();

  // PARSE URL QUERY PARAMS
  useEffect(() => {
    const parsed = queryString.parse(search);
    setReferenceId(String(parsed?.referenceId));
  }, [search]);

  // INITIALIZE GET BOOKING DETAILS QUERY
  const [
    getBookingDetails,
    {
      data: bookingDetailsData,
      isFetching: bookingDetailsIsFetching,
      isSuccess: bookingDetailsIsSuccess,
      isError: bookingDetailsIsError,
      error: bookingDetailsError,
    },
  ] = useLazyGetBookingDetailsQuery();

  // GET BOOKING DETAILS
  useEffect(() => {
    if (referenceId) {
      getBookingDetails({ referenceId });
    }
  }, [referenceId, getBookingDetails]);

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

  useEffect(() => {
    document.title = `${booking?.referenceId} - ${booking?.name} - Activities`;
  }, [booking]);

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
      isFetching: servicesIsFetching,
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
    <PublicLayout>
      <main className="w-[100vw] flex flex-col gap-6 p-4 max-h-[90vh]">
      <h1 className="text-primary font-medium uppercase text-lg text-center">
        Complete booking for {bookingDetailsIsSuccess ? booking?.name : '...'}{' '}
        scheduled on{' '}
        {bookingDetailsIsSuccess ? formatDate(booking?.startDate) : '...'}
      </h1>
      {(servicesIsFetching ||
        bookingDetailsIsFetching) && (
          <figure className="flex flex-col items-center gap-4 w-full min-h-[40vh]">
            <Loader className='text-primary' />
          </figure>
        )}
      {bookingDetailsIsSuccess &&
        servicesIsSuccess && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-[80%] mx-auto"
          >
            <fieldset className="flex flex-col gap-3 w-full">
              <section className="flex flex-col gap-5 w-full">
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
                {
                  servicesList.indexOf(selectedService) === 2 && (
                    <CreateBookingGuidesActivity />
                  )
                }
              </section>
            </fieldset>
          </form>
        )}
              <SelectBookingActivity />
    </main>
    </PublicLayout>
  );
};

export default CreateBookingActivities;
