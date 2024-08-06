import { useEffect } from 'react';
import {
  useLazyFetchServicesQuery,
  useLazyGetBookingDetailsQuery,
} from '../../states/apiSlice';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch, RootState } from '../../states/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedService,
  setServicesList,
} from '../../states/features/serviceSlice';
import Loader from '../../components/inputs/Loader';
import { Service } from '@/types/models/service.types';
import CreateBookingEntryActivity from './CreateBookingEntryActivity';
import CreateBookingActivitiesActivity from './CreateBookingActivitiesActivity';
import {
  getBookingAmountThunk,
  setBooking,
} from '@/states/features/bookingSlice';
import { formatCurrency, formatDate } from '@/helpers/strings.helper';
import CreateBookingGuidesActivity from './CreateBookingGuidesActivity';
import SelectBookingActivity from './SelectBookingActivity';
import PublicLayout from '@/containers/PublicLayout';

const CreateBookingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const {
    booking,
    bookingAmount,
    bookingAmountIsSuccess,
    bookingAmountIsFetching,
  } = useSelector((state: RootState) => state.booking);
  const { bookingVehiclesList } = useSelector(
    (state: RootState) => state.bookingVehicle
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );

  // NAVIGATION
  const { id } = useParams();
  const navigate = useNavigate();

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
    if (id) {
      getBookingDetails({ id });
    }
  }, [id, getBookingDetails, selectedService]);

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
    if (bookingDetailsIsSuccess) {
      document.title = `${booking?.referenceId} - ${booking?.name} - Activities`;
    }
  }, [booking, bookingDetailsIsSuccess]);

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
    fetchServices({ size: 100, page: 0 });
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

  // FETCH BOOKING AMOUNT
  useEffect(() => {
    dispatch(getBookingAmountThunk({ id: booking.id }));
  }, [
    booking,
    dispatch,
    bookingVehiclesList,
    bookingActivitiesList,
    bookingPeopleList,
    bookingVehiclesList,
  ]);

  if (servicesIsFetching || bookingDetailsIsFetching) {
    return (
      <PublicLayout>
        <figure className="flex flex-col items-center justify-center gap-4 w-full min-h-[80vh]">
          <Loader className="text-primary" />
        </figure>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="w-[100vw] flex flex-col gap-6 p-4 max-h-[90vh]">
        <h1 className="text-primary font-medium uppercase text-lg text-center">
          Complete {booking?.type} for{' '}
          {bookingDetailsIsSuccess ? booking?.name : '...'} scheduled on{' '}
          {bookingDetailsIsSuccess ? formatDate(booking?.startDate) : '...'}
        </h1>
        {bookingDetailsIsSuccess && servicesIsSuccess && (
          <form className="flex flex-col gap-4 w-[80%] mx-auto">
            <fieldset className="flex flex-col gap-3 w-full">
              <section className="flex flex-col gap-4 w-full">
                <h1 className="text-lg text-center font-medium">
                  Select a service to view available activities, schedules, and
                  their respective prices.
                </h1>
                <menu className="flex justify-between items-center w-full gap-4">
                  {servicesList.map((service) => {
                    return (
                      selectedService.id === service.id && (
                        <h1
                          key={service?.id}
                          className="p-1 px-2 text-[15px] rounded-md text-white bg-primary"
                        >
                          {service.name}
                        </h1>
                      )
                    );
                  })}
                  {bookingAmountIsFetching ? (
                    <ul className="flex items-center gap-1 text-[15px] bg-primary text-white p-1 px-2 rounded-md shadow-sm">
                      <Loader className="text-primary" />
                    </ul>
                  ) : (
                    bookingAmountIsSuccess && (
                      <ul className="flex items-center gap-1 text-[15px] bg-primary text-white p-1 px-2 rounded-md shadow-sm">
                        <p className="uppercase">Current Total:</p>
                        <p>{formatCurrency(bookingAmount)}</p>
                      </ul>
                    )
                  )}
                </menu>
                {servicesList.indexOf(selectedService) === 0 && (
                  <CreateBookingEntryActivity />
                )}
                {servicesList.indexOf(selectedService) === 1 && (
                  <CreateBookingActivitiesActivity />
                )}
                {servicesList.indexOf(selectedService) === 2 && (
                  <CreateBookingGuidesActivity />
                )}
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
