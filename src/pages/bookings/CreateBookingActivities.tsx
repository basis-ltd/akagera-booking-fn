import { useEffect } from 'react';
import {
  useLazyFetchServicesQuery,
  useLazyGetBookingAmountQuery,
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
import { setBooking, setBookingAmount } from '@/states/features/bookingSlice';
import { formatCurrency, formatDate } from '@/helpers/strings.helper';
import CreateBookingGuidesActivity from './CreateBookingGuidesActivity';
import SelectBookingActivity from './SelectBookingActivity';
import PublicLayout from '@/containers/PublicLayout';
import ListExistingBookingActivities from '@/containers/ListExistingBookingActivities';

const CreateBookingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const { booking, bookingAmount } = useSelector(
    (state: RootState) => state.booking
  );
  const { bookingVehiclesList } = useSelector(
    (state: RootState) => state.bookingVehicle
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const {
    selectBookingActivityModal,
    addBehindTheScenesActivityModal,
    addBoatTripMorningDayActivityModal,
    addCampingActivitiesModal,
  } = useSelector((state: RootState) => state.activity);

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
        toast.error((bookingDetailsError as ErrorResponse)?.data?.message);
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
        toast.error((servicesError as ErrorResponse)?.data?.message);
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

  // INITIALIZE GET BOOKING AMOUNT QUERY
  const [
    getBookingAmount,
    {
      data: bookingAmountData,
      error: bookingAmountError,
      isFetching: bookingAmountIsFetching,
      isSuccess: bookingAmountIsSuccess,
      isError: bookingAmountIsError,
    },
  ] = useLazyGetBookingAmountQuery();

  // GET BOOKING AMOUNT
  useEffect(() => {
    if (booking?.id) {
      getBookingAmount({ id: booking.id });
    }
  }, [
    booking,
    getBookingAmount,
    dispatch,
    bookingVehiclesList,
    bookingActivitiesList,
    bookingPeopleList,
    bookingVehiclesList,
    selectBookingActivityModal,
    addBehindTheScenesActivityModal,
    addBoatTripMorningDayActivityModal,
    addCampingActivitiesModal,
  ]);

  // HANDLE GET BOOKING AMOUNT RESPONSE
  useEffect(() => {
    if (bookingAmountIsError) {
      if ((bookingAmountError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking amount. Please try again later.'
        );
      } else {
        toast.error((bookingAmountError as ErrorResponse)?.data?.message);
      }
    } else if (bookingAmountIsSuccess) {
      dispatch(setBookingAmount(bookingAmountData?.data));
    }
  }, [
    bookingAmountIsSuccess,
    bookingAmountIsError,
    bookingAmountData,
    bookingAmountError,
    dispatch,
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
      <main className="flex flex-col gap-6 p-4 pt-8 min-h-[90vh] w-full">
        <article className='w-full flex flex-col gap-5'>
        <h1 className="text-primary font-medium uppercase text-lg text-center w-full text-wrap max-[1000px]:text-md">
          Complete {booking?.type} for{' '}
          {bookingDetailsIsSuccess ? booking?.name : '...'} scheduled on{' '}
          {bookingDetailsIsSuccess
            ? `${formatDate(booking?.startDate)} - ${formatDate(
                booking?.endDate
              )}`
            : '...'}
        </h1>
        <h1 className="text-lg text-center font-medium text-wrap w-full max-[1000px]:w-fit">
          Select a service to view available activities, schedules, and their
          respective prices.
        </h1>
        </article>
        {bookingDetailsIsSuccess && servicesIsSuccess && (
          <form className="flex flex-col gap-4 w-full max-w-[85%] mx-auto">
            <fieldset className="flex flex-col gap-3 w-full">
              <section className="flex flex-col gap-4 w-full overflow-x-auto">
                <menu className="flex flex-wrap justify-between items-center w-full gap-4 max-[800px]:flex-col">
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
                      <Loader className="text-white" />
                    </ul>
                  ) : (
                    bookingAmountIsSuccess &&
                    bookingAmount > 0 && (
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
        <ListExistingBookingActivities />
      </main>
    </PublicLayout>
  );
};

export default CreateBookingActivities;
