import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { vehicleTypes } from '@/constants/vehicles';
import { formatDate } from '@/helpers/strings';
import {
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingPeopleQuery,
  useLazyFetchBookingVehiclesQuery,
  useLazyGetBookingDetailsQuery,
  useUpdateBookingMutation,
} from '@/states/apiSlice';
import { setBookingActivitiesList } from '@/states/features/bookingActivitySlice';
import { setBookingPeopleList } from '@/states/features/bookingPeopleSlice';
import { setBooking } from '@/states/features/bookingSlice';
import { setBookingVehiclesList } from '@/states/features/bookingVehicleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingPreview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { bookingVehiclesList } = useSelector(
    (state: RootState) => state.bookingVehicle
  );

  // NAVIGATION
  const { id } = useParams();
  const navigate = useNavigate();

  // INITIALIZE GET BOOKING DETAILS QUERY
  const [
    getBookingDetails,
    {
      data: bookingDetailsData,
      error: bookingDetailsError,
      isSuccess: bookingDetailsIsSuccess,
      isError: bookingDetailsIsError,
      isLoading: bookingDetailsIsLoading,
    },
  ] = useLazyGetBookingDetailsQuery();

  // INITIALIZE FETCH BOOKING ACTIVITIES QUERY
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      error: bookingActivitiesError,
      isSuccess: bookingActivitiesIsSuccess,
      isError: bookingActivitiesIsError,
      isLoading: bookingActivitiesIsLoading,
    },
  ] = useLazyFetchBookingActivitiesQuery();

  // INITIALIZE FETCH BOOKING PEOPLE QUERY
  const [
    fetchBookingPeople,
    {
      data: bookingPeopleData,
      error: bookingPeopleError,
      isSuccess: bookingPeopleIsSuccess,
      isError: bookingPeopleIsError,
      isLoading: bookingPeopleIsLoading,
    },
  ] = useLazyFetchBookingPeopleQuery();

  // INITIALIZE FETCH BOOKING VEHICLES QUERY
  const [
    fetchBookingVehicles,
    {
      data: bookingVehiclesData,
      error: bookingVehiclesError,
      isSuccess: bookingVehiclesIsSuccess,
      isError: bookingVehiclesIsError,
      isLoading: bookingVehiclesIsLoading,
    },
  ] = useLazyFetchBookingVehiclesQuery();

  // INITIALIZE UPDATE BOOKING MUTATION
  const [
    updateBooking,
    {
      isLoading: updateBookingIsLoading,
      error: updateBookingError,
      isSuccess: updateBookingIsSuccess,
      isError: updateBookingIsError,
    },
  ] = useUpdateBookingMutation();

  // FETCH BOOKING VEHICLES
  useEffect(() => {
    if (booking?.id) {
      fetchBookingVehicles({ bookingId: booking?.id, take: 100 });
    }
  }, [fetchBookingVehicles, booking]);

  // FETCH BOOKING PEOPLE
  useEffect(() => {
    if (booking?.id) {
      fetchBookingPeople({ bookingId: booking?.id, take: 100 });
    }
  }, [fetchBookingPeople, booking]);

  // GET BOOKING DETAILS
  useEffect(() => {
    if (id) {
      getBookingDetails({ id });
    }
  }, [getBookingDetails, id]);

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    if (booking?.id) {
      fetchBookingActivities({ bookingId: booking?.id, take: 100 });
    }
  }, [fetchBookingActivities, booking]);

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

  // HANDLE FETCH BOOKING VEHICLES RESPONSE
  useEffect(() => {
    if (bookingVehiclesIsError) {
      if ((bookingVehiclesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking vehicles. Please try again later.'
        );
      } else {
        toast.error((bookingVehiclesError as ErrorResponse).data.message);
      }
    } else if (bookingVehiclesIsSuccess) {
      dispatch(setBookingVehiclesList(bookingVehiclesData?.data?.rows));
    }
  }, [
    bookingVehiclesIsSuccess,
    bookingVehiclesIsError,
    bookingVehiclesData,
    bookingVehiclesError,
    dispatch,
  ]);

  // HANDLE UPDATE BOOKING RESPONSE
  useEffect(() => {
    if (updateBookingIsError) {
      if ((updateBookingError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while updating booking. Please try again later.'
        );
      } else {
        toast.error((updateBookingError as ErrorResponse).data.message);
      }
    } else if (updateBookingIsSuccess) {
      toast.success('Booking submitted successfully');
      navigate(`/bookings/${booking?.id}/success`);
    }
  }, [
    updateBookingIsError,
    updateBookingIsSuccess,
    updateBookingError,
    navigate,
    booking?.id,
  ]);

  // BOOKING ACTIVITIES COLUMNS
  const bookingActivitiesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Activity',
      accessorKey: 'activity.name',
    },
    {
      header: 'Start Time',
      accessorKey: 'startTime',
    },
    {
      header: 'End Time',
      accessorKey: 'endTime',
    },
    {
      header: 'Number of people',
      accessorKey: 'numberOfPeople',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] rounded-full bg-primary text-white"
              icon={faPenToSquare}
            />

            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
            />
          </menu>
        );
      },
    },
  ];

  // BOOKING PEOPLE COLUMNS
  const bookingPeopleColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Full Names',
      accessorKey: 'name',
    },
    {
      header: 'Age',
      accessorKey: 'age',
    },
    {
      header: 'Nationality',
      accessorKey: 'nationality',
    },
    {
      header: 'Residence',
      accessorKey: 'residence',
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] rounded-full bg-primary text-white"
              icon={faPenToSquare}
            />

            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
            />
          </menu>
        );
      },
    },
  ];

  // BOOKING VEHICLES COLUMNS
  const bookingVehiclesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Vehicle Type',
      accessorKey: 'vehicleType',
    },
    {
      header: 'Registration Country',
      accessorKey: 'registrationCountry',
    },
    {
      header: 'Plate Number',
      accessorKey: 'plateNumber',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: () => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] rounded-full bg-primary text-white"
              icon={faPenToSquare}
            />

            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <main className="w-[95%] mx-auto flex flex-col gap-3 mb-4">
      {bookingDetailsIsLoading && (
        <figure className="w-full flex items-center justify-center min-h-[50vh]">
          <Loader />
        </figure>
      )}
      <h1 className="text-xl text-primary text-center font-bold uppercase">
        Booking Preview for {booking?.name} scheduled on{' '}
        {formatDate(booking?.startDate)}
      </h1>
      <menu className="w-full flex flex-col gap-3 mt-4">
        <ul className="flex items-center gap-6 my-2">
          <h1 className="font-bold text-xl uppercase">Details</h1>
          <Button className="!py-[2px] underline !text-[12px]" styled={false}>
            Update
          </Button>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Full Names / Tour company:</p>
          <p>{booking?.name}</p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Reference ID:</p>
          <p className="flex items-center gap-1">
            {booking?.referenceId}{' '}
            <span className="text-[12px]">
              (Use this reference ID to track or update your booking)
            </span>
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Date:</p>
          <p>{formatDate(booking?.startDate)}</p>
        </ul>
      </menu>
      {bookingActivitiesIsLoading ? (
        <figure className="w-full flex items-center justify-center min-h-[50vh]">
          <Loader />
        </figure>
      ) : (
        bookingActivitiesIsSuccess && (
          <menu className="flex flex-col gap-2 w-full">
            <ul className="flex items-center gap-6 my-2">
              <h1 className="font-bold text-xl uppercase">Activities</h1>
              <Button
                className="!py-[2px] underline !text-[12px]"
                styled={false}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/bookings/create?referenceId=${booking?.referenceId}`
                  );
                }}
              >
                Update
              </Button>
            </ul>
            <Table
              showFilter={false}
              showPagination={false}
              columns={bookingActivitiesColumns}
              data={bookingActivitiesList?.map((bookingActivity, index) => {
                return {
                  no: index + 1,
                  activity: bookingActivity?.activity,
                  endTime: bookingActivity.endTime,
                  numberOfPeople: bookingActivity.numberOfPeople,
                  startTime: moment(bookingActivity.startTime).format(
                    'hh:mm A'
                  ),
                };
              })}
            />
          </menu>
        )
      )}
      {bookingPeopleIsLoading ? (
        <figure className="w-full flex items-center justify-center min-h-[50vh]">
          <Loader />
        </figure>
      ) : (
        bookingPeopleIsSuccess && (
          <menu className="flex flex-col gap-2 w-full">
            <ul className="flex items-center gap-6 my-2">
              <h1 className="font-bold text-xl uppercase">People</h1>
              <Button
                className="!py-[2px] underline !text-[12px]"
                styled={false}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/bookings/create?referenceId=${booking?.referenceId}`
                  );
                }}
              >
                Update
              </Button>
            </ul>
            <Table
              showFilter={false}
              showPagination={false}
              columns={bookingPeopleColumns}
              data={bookingPeopleList?.map((bookingPerson, index) => {
                return {
                  ...bookingPerson,
                  no: index + 1,
                  name: bookingPerson.name,
                  age: moment().diff(bookingPerson.dateOfBirth, 'years'),
                  email: bookingPerson.email,
                  nationality: COUNTRIES.find(
                    (country) => country?.code === bookingPerson?.nationality
                  )?.name,
                  residence: COUNTRIES.find(
                    (country) => country?.code === bookingPerson?.residence
                  )?.name,
                  gender: genderOptions?.find(
                    (gender) => gender?.value === bookingPerson?.gender
                  )?.label,
                };
              })}
            />
          </menu>
        )
      )}
      {bookingVehiclesIsLoading ? (
        <figure className="w-full flex items-center justify-center min-h-[50vh]">
          <Loader />
        </figure>
      ) : (
        bookingVehiclesIsSuccess && (
          <menu className="flex flex-col gap-2 w-full">
            <ul className="flex items-center gap-6 my-2">
              <h1 className="font-bold text-xl uppercase">Vehicles</h1>
              <Button
                className="!py-[2px] underline !text-[12px]"
                styled={false}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(
                    `/bookings/create?referenceId=${booking?.referenceId}`
                  );
                }}
              >
                Update
              </Button>
            </ul>
            <Table
              showFilter={false}
              showPagination={false}
              columns={bookingVehiclesColumns}
              data={bookingVehiclesList?.map((bookingVehicle, index) => {
                return {
                  ...bookingVehicle,
                  no: index + 1,
                  vehicleType: vehicleTypes.find(
                    (vehicleType) =>
                      vehicleType?.value === bookingVehicle?.vehicleType
                  )?.label,
                  registrationCountry: COUNTRIES.find(
                    (country) =>
                      country?.code === bookingVehicle?.registrationCountry
                  )?.name,
                };
              })}
            />
          </menu>
        )
      )}
      <menu className="flex items-center gap-3 justify-between">
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate(`/bookings/create?referenceId=${booking?.referenceId}`);
          }}
        >
          Back
        </Button>
        <Button
          primary
          onClick={(e) => {
            e.preventDefault();
            updateBooking({ id: booking?.id, status: 'pending' });
          }}
        >
          {updateBookingIsLoading ? <Loader /> : 'Submit'}
        </Button>
      </menu>
    </main>
  );
};

export default BookingPreview;
