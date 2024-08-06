import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { bookingActivitiesColumns } from '@/constants/bookingActivity.constants';
import { bookingPeopleColumns } from '@/constants/bookingPerson.constants';
import { bookingVehicleColumns } from '@/constants/bookingVehicle.constants';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { paymentColumns } from '@/constants/payment.constants';
import { vehicleTypes } from '@/constants/vehicles.constants';
import AdminLayout from '@/containers/AdminLayout';
import {
  calculateActivityPrice,
  calculateBookingPersonPrice,
  calculateVehiclePrice,
  getBookingStatusColor,
} from '@/helpers/booking.helper';
import {
  formatDate,
  formatCurrency,
  capitalizeString,
} from '@/helpers/strings.helper';
import {
  useConfirmPaymentMutation,
  useLazyFetchBookingActivitiesQuery,
  useLazyFetchBookingPeopleQuery,
  useLazyFetchBookingVehiclesQuery,
  useLazyFetchPaymentsQuery,
  useLazyGetBookingDetailsQuery,
  useUpdateBookingMutation,
} from '@/states/apiSlice';
import { setBookingActivitiesList } from '@/states/features/bookingActivitySlice';
import { setBookingPeopleList } from '@/states/features/bookingPeopleSlice';
import {
  addBookingTotalAmountUsd,
  setBooking,
  setBookingPaymentsList,
  updateBookingPayment,
} from '@/states/features/bookingSlice';
import { setBookingVehiclesList } from '@/states/features/bookingVehicleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import { Payment } from '@/types/models/payment.types';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { booking, bookingPaymentsList } = useSelector(
    (state: RootState) => state.booking
  );
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
  ] = useUpdateBookingMutation();

  // FETCH BOOKING VEHICLES
  useEffect(() => {
    if (booking?.id) {
      fetchBookingVehicles({ bookingId: booking?.id, size: 100 });
    }
  }, [fetchBookingVehicles, booking]);

  // FETCH BOOKING PEOPLE
  useEffect(() => {
    if (booking?.id) {
      fetchBookingPeople({ bookingId: booking?.id, size: 100 });
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
      fetchBookingActivities({ bookingId: booking?.id, size: 100 });
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
            price: `USD ${calculateActivityPrice(bookingActivity)}`,
            startTime: moment(bookingActivity.startTime).format('hh:mm A'),
            numberOfPeople: bookingActivity?.bookingActivityPeople?.length,
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
      toast.success('Booking updated successfully');
      navigate(`/dashboard/${booking?.type}s`);
    }
  }, [
    updateBookingIsError,
    updateBookingIsSuccess,
    updateBookingError,
    navigate,
    booking,
  ]);

  // INITIALIZE FETCH PAYMENTS QUERY
  const [
    fetchPayments,
    {
      data: paymentsData,
      error: paymentsError,
      isSuccess: paymentsIsSuccess,
      isError: paymentsIsError,
      isFetching: paymentsIsFetching,
    },
  ] = useLazyFetchPaymentsQuery();

  // FETCH BOOKING PAYMENTS
  useEffect(() => {
    if (booking?.id) {
      fetchPayments({ bookingId: booking?.id, size: 100 });
    }
  }, [fetchPayments, booking]);

  // HANDLE FETCH PAYMENTS RESPONSE
  useEffect(() => {
    if (paymentsIsError) {
      if ((paymentsError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking payments. Please try again later.'
        );
      } else {
        toast.error((paymentsError as ErrorResponse).data.message);
      }
    } else if (paymentsIsSuccess) {
      dispatch(setBookingPaymentsList(paymentsData?.data?.rows));
    }
  }, [
    paymentsIsSuccess,
    paymentsIsError,
    paymentsData,
    paymentsError,
    dispatch,
  ]);

  // INITIALIZE CONFIRM PAYMENT MUTATION
  const [
    confirmPayment,
    {
      isLoading: confirmPaymentIsLoading,
      error: confirmPaymentError,
      isSuccess: confirmPaymentIsSuccess,
      isError: confirmPaymentIsError,
      data: confirmPaymentData,
    },
  ] = useConfirmPaymentMutation();

  // HANDLE CONFIRM PAYMENT RESPONSE
  useEffect(() => {
    if (confirmPaymentIsError) {
      if ((confirmPaymentError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while confirming payment. Please try again later.'
        );
      } else {
        toast.error((confirmPaymentError as ErrorResponse).data.message);
      }
    } else if (confirmPaymentIsSuccess) {
      toast.success('Payment confirmed successfully');
      dispatch(updateBookingPayment(confirmPaymentData?.data));
    }
  }, [
    confirmPaymentIsError,
    confirmPaymentIsSuccess,
    confirmPaymentError,
    dispatch,
    confirmPaymentData?.data,
  ]);

  // BOOKING ACTIVITIES COLUMNS
  const bookingActivitiesExtendedColumns = [...bookingActivitiesColumns];

  // BOOKING PEOPLE COLUMNS
  const bookingPeopleExtendedColumns = [...bookingPeopleColumns];

  // BOOKING VEHICLES COLUMNS
  const bookingVehiclesExtendedColumns = [...bookingVehicleColumns];

  // BOOKING PAYMENTS COLUMNS
  const paymentExtendedColumns = [
    ...paymentColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Payment> }) => {
        return (
          <menu className="flex items-center gap-3">
            {row?.original?.status === 'PAID' && (
              <CustomTooltip label="Click to confirm payment">
                {confirmPaymentIsLoading ? (
                  '...'
                ) : (
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    onClick={(e) => {
                      e.preventDefault();
                      confirmPayment({ id: row?.original?.id });
                    }}
                    className="bg-green-700 text-white p-2 px-[8.2px] transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full"
                  />
                )}
              </CustomTooltip>
            )}
          </menu>
        );
      },
    },
  ];

  // BREADCRUMB LINKS
  const breadcrumbLinks = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: `${capitalizeString(booking?.type)}s`,
      route: `/dashboard/${booking?.type}s`,
    },
    {
      label: `${booking?.name}`,
      route: `/dashboard/bookings/${id}/details`,
    },
  ];

  return (
    <AdminLayout>
      <main className="w-[85%] mx-auto flex flex-col gap-3 mb-8">
        <h1 className="text-xl text-primary text-center font-bold uppercase">
          {booking?.type} Details for {booking?.name} scheduled on{' '}
          {formatDate(booking?.startDate)}
        </h1>
        {bookingDetailsIsFetching && (
          <figure className="w-full flex items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
          </figure>
        )}
        <menu className="w-full flex flex-col gap-3 my-6 max-[700px]:gap-6">
          <CustomBreadcrumb navigationLinks={breadcrumbLinks} />
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
            </p>
          </ul>
          <ul className="flex items-center gap-2 max-[700px]:flex-col max-[700px]:gap-1">
            <p>Date:</p>
            <p className="font-bold">{formatDate(booking?.startDate)}</p>
          </ul>
          <ul className="flex items-center gap-2 max-[700px]:flex-col max-[700px]:gap-1">
            <p>Accomodation:</p>
            <p className="font-bold">
              {capitalizeString(booking?.accomodation) || 'N/A'}
            </p>
          </ul>
          <ul className="flex items-center gap-2 max-[700px]:flex-col max-[700px]:gap-1">
            <p>Status:</p>
            <p
              className={`font-medium p-1 rounded-md text-[14px] ${getBookingStatusColor(
                booking?.status
              )}`}
            >
              {capitalizeString(booking?.status)}
            </p>
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
              </ul>
              <Table
                showFilter={false}
                showPagination={false}
                columns={
                  bookingPeopleExtendedColumns as ColumnDef<BookingPerson>[]
                }
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
                    price: `USD ${calculateBookingPersonPrice(bookingPerson)}`,
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
              </ul>
              <Table
                showFilter={false}
                showPagination={false}
                columns={
                  bookingVehiclesExtendedColumns as ColumnDef<BookingVehicle>[]
                }
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
        {paymentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[10vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          paymentsIsSuccess && (
            <menu className="flex flex-col gap-2 w-full">
              <ul className="flex items-center gap-3 w-full justify-between my-2 px-1">
                <h1 className="font-bold text-xl uppercase">Payments</h1>
              </ul>
              <Table
                showFilter={false}
                showPagination={false}
                columns={paymentExtendedColumns as ColumnDef<Payment>[]}
                data={bookingPaymentsList?.map((payment, index) => {
                  return {
                    ...payment,
                    no: index + 1,
                    amount: formatCurrency(payment?.amount),
                    currency: payment?.currency,
                    status: payment?.status,
                    createdAt: formatDate(payment?.createdAt),
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
              {formatCurrency(Number(booking?.totalAmountUsd) * 1343, 'RWF')}
            </p>
          </ul>
        </menu>
        <menu className="w-full flex items-center gap-3 justify-between my-4">
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              updateBooking({ id: booking?.id, status: 'declined' });
            }}
          >
            {updateBookingIsLoading ? <Loader /> : 'Decline'}
          </Button>
          {!['pending', 'pending_contact'].includes(booking?.status) ? (
            <Button route={`/dashboard/${booking?.type}s`}>Return</Button>
          ) : (
            <Button
              primary
              disabled={
                !bookingPaymentsList?.every(
                  (payment) => payment?.status === 'CONFIRMED'
                )
              }
              onClick={(e) => {
                e.preventDefault();
                updateBooking({ id: booking?.id, status: 'confirmed' });
              }}
            >
              {updateBookingIsLoading ? <Loader /> : 'Confirm'}
            </Button>
          )}
        </menu>
      </main>
    </AdminLayout>
  );
};

export default BookingDetails;
