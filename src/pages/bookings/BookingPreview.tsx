import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Table from '@/components/table/Table';
import { bookingActivitiesColumns } from '@/constants/bookingActivity.constants';
import { bookingPeopleColumns } from '@/constants/bookingPerson.constants';
import { bookingPaymentMethods } from '@/constants/bookings.constants';
import { bookingVehicleColumns } from '@/constants/bookingVehicle.constants';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { vehicleTypes } from '@/constants/vehicles.constants';
import PublicLayout from '@/containers/PublicLayout';
import {
  calculateActivityPrice,
  calculateBookingPersonPrice,
  calculateVehiclePrice,
} from '@/helpers/booking.helper';
import { formatDate, formatCurrency } from '@/helpers/strings.helper';
import {
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingPeopleQuery,
  useLazyFetchBookingVehiclesQuery,
  useLazyGetBookingDetailsQuery,
  useSubmitBookingMutation,
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
import { useEffect, useState } from 'react';
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
  const [bookingStatus, setBookingStatus] = useState('pending_contact');

  // NAVIGATION
  const { id } = useParams();
  const navigate = useNavigate();

  // RESET TOTAL AMOUNT ON INITIAL LOAD
  useEffect(() => {
    dispatch(addBookingTotalAmountUsd(0));
  }, [dispatch]);

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
  ] = useSubmitBookingMutation();

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
            price: bookingActivity?.defaultRate
              ? formatCurrency(
                  bookingActivity?.defaultRate *
                    Number(bookingActivity?.numberOfSeats)
                )
              : `${formatCurrency(calculateActivityPrice(bookingActivity))}`,
            numberOfPeople: bookingActivity?.bookingActivityPeople?.length,
            numberOfAdults: bookingActivity?.numberOfAdults || '',
            numberOfChildren: bookingActivity?.numberOfChildren || '',
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
  const bookingActivitiesExtendedColumns = [
    ...bookingActivitiesColumns,
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
  const bookingPeopleExtendedColumns = [
    ...bookingPeopleColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingPerson> }) => {
        return (
          <menu className="flex items-center gap-3">
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
  const bookingVehicleExtendedColumns = [
    ...bookingVehicleColumns,
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
          (acc, curr) => acc + Number(String(curr?.price)?.split('$')[1]),
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
          (acc, curr) => acc + Number(calculateBookingPersonPrice(curr)),
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

  // SET DOCUMENT TITLE
  useEffect(() => {
    document.title = `Booking Preview for ${
      booking?.name
    } scheduled on ${formatDate(booking?.startDate)}`;
  }, [booking]);

  if (bookingDetailsIsFetching) {
    return (
      <PublicLayout>
        <figure className="w-full flex items-center justify-center min-h-[80vh]">
          <Loader className="text-primary" />
        </figure>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <main className="w-[85%] mx-auto flex flex-col gap-3 mb-8">
        <h1 className="text-xl text-primary text-center font-bold uppercase">
          {booking?.type} Preview for {booking?.name} scheduled on{' '}
          {formatDate(booking?.startDate)}
        </h1>
        <menu className="w-full flex flex-col gap-3 my-6 max-[700px]:gap-6">
          <ul className="flex items-center gap-3 w-full justify-between my-2 px-1 max-[700px]:flex-col">
            <h1 className="font-bold text-xl uppercase">Details</h1>
          </ul>
          <ul className="flex items-center gap-2 max-[700px]:flex-col max-[700px]:gap-1">
            <p>Full Names / Tour company:</p>
            <p className="font-bold">{booking?.name}</p>
          </ul>
          <ul className="flex items-center gap-2 max-[700px]:flex-col max-[700px]:gap-1">
            <p>Reference ID:</p>
            <p className="flex items-center gap-1 max-[700px]:flex-col">
              <strong>{booking?.referenceId} </strong>
              <span className="text-[12px]">
                (Use this reference ID to track or update your {booking?.type})
              </span>
            </p>
          </ul>
          <ul className="flex items-center gap-2 max-[700px]:flex-col max-[700px]:gap-1">
            <p>Date:</p>
            <p className="font-bold">{formatDate(booking?.startDate)}</p>
          </ul>
        </menu>
        {booking?.type !== 'registration' &&
          (bookingActivitiesIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[50vh]">
              <Loader className="text-primary" />
            </figure>
          ) : (
            bookingActivitiesIsSuccess && (
              <menu className="flex flex-col gap-2 w-full">
                <ul className="flex items-center gap-3 w-full justify-between my-2 px-1">
                  <h1 className="font-bold text-xl uppercase">Activities</h1>
                  <Button
                    className="!py-[2px] underline !text-[12px]"
                    styled={false}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/bookings/${booking?.id}/create`);
                    }}
                  >
                    Update
                  </Button>
                </ul>
                {bookingActivitiesList?.length > 0 ? (
                  <Table
                    showFilter={false}
                    showPagination={false}
                    columns={bookingActivitiesExtendedColumns}
                    data={bookingActivitiesList}
                  />
                ) : (
                  <article className="flex w-full flex-col items-center gap-4 my-6">
                    <p className="text-center text-primary font-medium">
                      No activities added to this booking. Click the button
                      below to add them now.
                    </p>
                    <Button primary route={`/bookings/${booking?.id}/create`}>
                      Add activities
                    </Button>
                  </article>
                )}
              </menu>
            )
          ))}
        {bookingPeopleIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          bookingPeopleIsSuccess && (
            <menu className="flex flex-col gap-2 w-full">
              <ul className="flex items-center gap-3 w-full justify-between my-2 px-1">
                <h1 className="font-bold text-xl uppercase">People</h1>
                <Button
                  className="!py-[2px] underline !text-[12px]"
                  styled={false}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/bookings/${booking?.id}/create`);
                  }}
                >
                  Update
                </Button>
              </ul>
              <Table
                showFilter={false}
                showPagination={false}
                columns={bookingPeopleExtendedColumns as ColumnDef<BookingPerson>[]}
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
                    price: `${formatCurrency(
                      calculateBookingPersonPrice(bookingPerson)
                    )}`,
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
                    navigate(`/bookings/${booking?.id}/create`);
                  }}
                >
                  Update
                </Button>
              </ul>
              <Table
                showFilter={false}
                showPagination={false}
                columns={bookingVehicleExtendedColumns as ColumnDef<BookingVehicle>[]}
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
                    vehiclePrice: `${formatCurrency(
                      calculateVehiclePrice(bookingVehicle)
                    )}`,
                  };
                })}
              />
            </menu>
          )
        )}
        <menu className="flex items-start gap-3 justify-between w-full my-4 px-2">
          <h1 className="text-primary font-bold uppercase">Total</h1>
          <ul className="flex flex-col items-start gap-2">
            <p className="uppercase font-medium underline">
              {formatCurrency(Number(booking?.totalAmountUsd))}
            </p>
            <p className="uppercase font-medium underline">
              {formatCurrency(Number(booking?.totalAmountUsd) * 1303, 'RWF')}
            </p>
          </ul>
        </menu>
        <menu className="w-full flex items-center gap-3 justify-end">
          <Select
            label="Payment method"
            required
            placeholder="Select payment method"
            value={bookingStatus}
            labelClassName="!w-[50%] self-end"
            options={bookingPaymentMethods?.map((method) => {
              return {
                ...method,
                disabled: method?.value !== 'pending_contact',
              };
            })}
            onChange={(e) => {
              if (e === 'pending_contact') setBookingStatus(e);
            }}
          />
        </menu>
        <menu className="flex items-center gap-3 justify-between mb-6">
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/bookings/${booking?.id}/create`);
            }}
          >
            Back
          </Button>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              updateBooking({
                id: booking?.id,
                status: bookingStatus,
                totalAmountRwf: Number(booking?.totalAmountUsd) * 1303,
                totalAmountUsd: Number(booking?.totalAmountUsd),
              });
            }}
            disabled={!bookingStatus}
          >
            {updateBookingIsLoading ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </main>
    </PublicLayout>
  );
};

export default BookingPreview;
