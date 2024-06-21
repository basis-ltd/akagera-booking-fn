import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { vehicleTypes } from '@/constants/vehicles.constants';
import PublicLayout from '@/containers/PublicLayout';
import {
  calculateActivityPrice,
  calculateEntryPrice,
  calculateVehiclePrice,
} from '@/helpers/booking.helper';
import { formatDate } from '@/helpers/strings';
import {
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingPeopleQuery,
  useLazyFetchBookingVehiclesQuery,
  useLazyGetBookingDetailsQuery,
  useUpdateBookingMutation,
} from '@/states/apiSlice';
import {
  setBookingActivitiesList,
  setDeleteBookingActivityModal,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import {
  setBookingPeopleList,
  setDeleteBookingPersonModal,
  setSelectedBookingPerson,
} from '@/states/features/bookingPeopleSlice';
import {
  addBookingTotalAmountUsd,
  setBooking,
} from '@/states/features/bookingSlice';
import {
  setBookingVehiclesList,
  setDeleteBookingVehicleModal,
  setSelectedBookingVehicle,
} from '@/states/features/bookingVehicleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
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
      isFetching: bookingDetailsIsFetching,
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
      isFetching: bookingActivitiesIsFetching,
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
      isFetching: bookingPeopleIsFetching,
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
      isFetching: bookingVehiclesIsFetching,
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
      const formattedBookingActivities = bookingActivitiesData?.data?.rows.map(
        (bookingActivity: BookingActivity, index: number) => {
          return {
            ...bookingActivity,
            no: index + 1,
            activity: bookingActivity?.activity,
            endTime: bookingActivity.endTime,
            price: `USD ${calculateActivityPrice(
              bookingActivity,
              bookingActivity?.bookingActivityPeople
            )}`,
            startTime: moment(bookingActivity.startTime).format('hh:mm A'),
            numberOfPeople:
              bookingActivity?.bookingActivityPeople?.length || 'N/A',
          };
        }
      );
      dispatch(setBookingActivitiesList(formattedBookingActivities));
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
      header: 'Price',
      accessorKey: 'price',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingActivity> }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingActivity(row?.original));
                dispatch(setDeleteBookingActivityModal(true));
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
      header: 'Number of days',
      accessorKey: 'numberOfDays',
    },
    {
      header: 'Entry fee',
      accessorKey: 'price',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingPerson> }) => {
        return (
          <menu className="flex items-center gap-3">
            {/* <FontAwesomeIcon
              icon={faPenToSquare}
              className="p-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full bg-primary text-white"
            /> */}
            <FontAwesomeIcon
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingPerson(row?.original));
                dispatch(setDeleteBookingPersonModal(true));
              }}
              className="bg-red-600 text-white p-2 px-[8.2px] transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full"
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
      header: 'Price',
      accessorKey: 'vehiclePrice',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingVehicle> }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingVehicle(row?.original));
                dispatch(setDeleteBookingVehicleModal(true));
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
            />
          </menu>
        );
      },
    },
  ];

  // SET ACTIVITIES TOTAL AMOUNT
  useEffect(() => {
    dispatch(
      addBookingTotalAmountUsd(
        bookingActivitiesList?.reduce(
          (acc, curr) => acc + Number(String(curr?.price)?.split(' ')[1]),
          0
        )
      )
    );
  }, [bookingActivitiesList, dispatch]);

  // SET PEOPLE TOTAL AMOUNT
  useEffect(() => {
    dispatch(
      addBookingTotalAmountUsd(
        bookingPeopleList?.reduce(
          (acc, curr) => acc + Number(calculateEntryPrice(curr)),
          0
        )
      )
    );
  }, [bookingPeopleList, dispatch]);

  // SET VEHICLES TOTAL AMOUNT
  useEffect(() => {
    dispatch(
      addBookingTotalAmountUsd(
        bookingVehiclesList?.reduce(
          (acc, curr) => acc + Number(calculateVehiclePrice(curr)),
          0
        )
      )
    );
  }, [bookingVehiclesList, dispatch]);

  return (
    <PublicLayout>
      <main className="w-[85%] mx-auto flex flex-col gap-3 mb-8">
        <h1 className="text-xl text-primary text-center font-bold uppercase">
          Booking Preview for {booking?.name} scheduled on{' '}
          {formatDate(booking?.startDate)}
        </h1>
        {bookingDetailsIsFetching && (
          <figure className="w-full flex items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
          </figure>
        )}
        <menu className="w-full flex flex-col gap-3 mt-4">
          <ul className="flex items-center gap-3 w-full justify-between my-2 px-2">
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
        {bookingActivitiesIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          bookingActivitiesIsSuccess && (
            <menu className="flex flex-col gap-2 w-full">
              <ul className="flex items-center gap-3 w-full justify-between my-2 px-2">
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
                data={bookingActivitiesList}
              />
            </menu>
          )
        )}
        {bookingPeopleIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          bookingPeopleIsSuccess && (
            <menu className="flex flex-col gap-2 w-full">
              <ul className="flex items-center gap-3 w-full justify-between my-2 px-2">
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
                columns={bookingPeopleColumns as ColumnDef<BookingPerson>[]}
                data={bookingPeopleList?.map((bookingPerson: BookingPerson) => {
                  return {
                    ...bookingPerson,
                    gender: genderOptions?.find(
                      (gender) => gender.value === bookingPerson?.gender
                    )?.label,
                    nationality: COUNTRIES?.find(
                      (country) => country.code === bookingPerson?.nationality
                    )?.name,
                    residence: COUNTRIES?.find(
                      (country) => country.code === bookingPerson?.residence
                    )?.name,
                    age: Number(
                      moment().diff(bookingPerson?.dateOfBirth, 'years', false)
                    ),
                    numberOfDays: Number(
                      moment(bookingPerson?.endDate).diff(
                        bookingPerson?.startDate,
                        'days'
                      )
                    ),
                    price: `USD ${calculateEntryPrice(bookingPerson)}`,
                  };
                })}
              />
            </menu>
          )
        )}
        {bookingVehiclesIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
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
                columns={bookingVehiclesColumns as ColumnDef<BookingVehicle>[]}
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
                    vehiclePrice: `USD ${calculateVehiclePrice(
                      bookingVehicle
                    )}`,
                  };
                })}
              />
            </menu>
          )
        )}
        <menu className="flex items-center gap-3 justify-between w-full my-4 px-2">
          <h1 className="text-primary font-bold uppercase">Total</h1>
          <p className="uppercase font-medium underline">
            USD {booking?.totalAmountUsd}
          </p>
        </menu>
        <menu className="flex items-center gap-3 justify-between mb-6">
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
            {updateBookingIsLoading ? (
              <Loader className="text-primary" />
            ) : (
              'Submit'
            )}
          </Button>
        </menu>
      </main>
    </PublicLayout>
  );
};

export default BookingPreview;
