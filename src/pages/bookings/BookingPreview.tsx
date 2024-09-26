import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { paymentColumns } from '@/constants/payment.constants';
import PublicLayout from '@/containers/PublicLayout';
import {
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
  useCreatePaymentMutation,
  useLazyFetchPaymentsQuery,
  useLazyGetBookingDetailsQuery,
} from '@/states/apiSlice';
import {
  addBookingTotalAmountUsd,
  getBookingAmountThunk,
  setBooking,
  setBookingPaymentsList,
  setCancellationPolicyModal,
  submitBookingThunk,
} from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingActivitiesPreview from './booking-preview/BookingActivitiesPreview';
import BookingPeoplePreview from './booking-preview/BookingPeoplePreview';
import BookingVehiclesPreview from './booking-preview/BookingVehiclesPreview';
import { ColumnDef, Row } from '@tanstack/react-table';
import { Payment } from '@/types/models/payment.types';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import moment from 'moment';

const BookingPreview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    booking,
    bookingPaymentsList,
    bookingAmount,
    bookingAmountIsFetching,
    bookingAmountIsSuccess,
    submitBookingIsLoading,
    submitBookingIsSuccess,
  } = useSelector((state: RootState) => state.booking);
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { bookingVehiclesList } = useSelector(
    (state: RootState) => state.bookingVehicle
  );
  const [bookingPaid, setBookingPaid] = useState(false);

  // REACT HOOK FORM
  const { watch, control } = useForm();

  // MANAGE BOOKING PAYMENT STATUS
  useEffect(() => {
    if (bookingPaymentsList?.length > 0) {
      const bookingPaid =
        bookingPaymentsList?.find((payment) => payment?.status === 'PAID') !==
          undefined &&
        bookingPaymentsList?.reduce(
          (acc, curr) => acc + Number(curr.amount),
          0
        ) >= Number(bookingAmount);
      setBookingPaid(bookingPaid);
    }
  }, [bookingAmount, bookingPaymentsList]);

  // NAVIGATION
  const { id } = useParams();
  const navigate = useNavigate();

  // FETCH BOOKING AMOUNT
  useEffect(() => {
    if (booking?.id) {
      dispatch(getBookingAmountThunk({ id: booking?.id }));
    }
  }, [booking, dispatch]);

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

  // GET BOOKING DETAILS
  useEffect(() => {
    if (id) {
      getBookingDetails({ id });
    }
  }, [getBookingDetails, id]);

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

  // INITIALIZE CREATE PAYMENT MUTATION
  const [
    createPayment,
    {
      isLoading: createPaymentIsLoading,
      error: createPaymentError,
      isSuccess: createPaymentIsSuccess,
      isError: createPaymentIsError,
      data: createPaymentData,
    },
  ] = useCreatePaymentMutation();

  // HANDLE CREATE PAYMENT RESPONSE
  useEffect(() => {
    if (createPaymentIsError) {
      if ((createPaymentError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while creating payment. Please try again later.'
        );
      } else {
        toast.error((createPaymentError as ErrorResponse).data.message);
      }
    } else if (createPaymentIsSuccess) {
      window.location.href = createPaymentData?.data?.payment?.redirectUrl;
    }
  }, [
    createPaymentIsError,
    createPaymentIsSuccess,
    createPaymentError,
    navigate,
    booking,
    dispatch,
    createPaymentData,
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

  // HANDLE SUBMIT BOOKING RESPONSE
  useEffect(() => {
    if (submitBookingIsSuccess) {
      toast.success('Booking submitted successfully.');
      navigate(`/bookings/${booking?.id}/success`);
    }
  }, [submitBookingIsSuccess, navigate, booking?.id]);

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

  // PAYMENT EXTENDED COLUMNS
  const paymentsExtendedColumns = [
    ...paymentColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Payment> }) => {
        if (row?.original?.status === 'PAID' || bookingPaid) return null;
        return (
          <menu className="w-full flex items-start justify-start">
            {moment(new Date()).diff(row?.original?.createdAt, 'day') <= 1 ? (
              <CustomTooltip label="Click to continue payment">
                <Link
                  to={`#`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `https://secure.3gdirectpay.com/dpopayment.php?ID=${row?.original?.transactionId}`;
                  }}
                  className="text-primary underline text-[14px] transition-all ease-in-out duration-300 hover:scale-[1.01]"
                >
                  Complete
                </Link>
              </CustomTooltip>
            ) : (
              <CustomTooltip label="Payment limit expired">
                <span className="text-gray-400 text-[14px]">
                  Payment expired
                </span>
              </CustomTooltip>
            )}
          </menu>
        );
      },
    },
  ];

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      route: `/bookings/${id}/create`,
      label: `${booking?.name}`,
    },
    {
      route: `/bookings/${id}/create`,
      label: `${capitalizeString(booking?.type)} activities`,
    },
    {
      route: `/bookings/${id}/consent`,
      label: 'Consent',
    },
    {
      route: `/bookings/${id}/preview`,
      label: 'Preview',
    },
  ];

  return (
    <PublicLayout>
      <main className="w-[85%] mx-auto flex flex-col gap-3 mb-8">
        <h1 className="text-xl text-primary text-center font-bold uppercase mt-8">
          {booking?.type} Preview for {booking?.name} scheduled on{' '}
          {formatDate(booking?.startDate)}
        </h1>
        <menu className="w-full flex flex-col gap-3 my-6 max-[700px]:gap-6">
          <CustomBreadcrumb navigationLinks={navigationLinks} />
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
        <BookingActivitiesPreview />
        <BookingPeoplePreview />
        <BookingVehiclesPreview />
        {paymentsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[10vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          bookingPaymentsList?.length > 0 &&
          paymentsIsSuccess && (
            <menu className="flex flex-col gap-2 w-full">
              <ul className="flex items-center gap-3 w-full justify-between my-2 px-1">
                <h1 className="font-bold text-xl uppercase">Payments</h1>
              </ul>
              <Table
                showFilter={false}
                showPagination={false}
                columns={paymentsExtendedColumns as ColumnDef<Payment>[]}
                data={bookingPaymentsList?.map((payment, index) => {
                  return {
                    ...payment,
                    no: index + 1,
                    currency: payment?.currency,
                    status: payment?.status,
                    createdAt: formatDate(payment?.createdAt),
                  };
                })}
              />
            </menu>
          )
        )}
        <menu className="flex items-start gap-3 justify-end w-full my-4 px-2">
          <h1 className="text-primary text-xl font-bold uppercase text-center">
            Total:
          </h1>
          {bookingAmountIsFetching ? (
            <figure className="flex items-center justify-center">
              <Loader />
            </figure>
          ) : (
            bookingAmountIsSuccess && (
              <ul className="flex flex-col items-start gap-2">
                <p className="uppercase font-bold text-xl text-primary">
                  {formatCurrency(booking?.totalAmountUsd)}
                </p>
                <p className="uppercase font-bold text-xl text-primary">
                  {formatCurrency(booking?.totalAmountRwf, 'RWF')}
                </p>
              </ul>
            )
          )}
        </menu>
        <menu className="flex items-center flex-col gap-3 justify-between mb-6">
          {booking?.consent ? (
            <>
              {!bookingPaid ? (
                <>
                  <Controller
                    name="consent"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="checkbox"
                          label={
                            <p>
                              I have read and understood the cancellation
                              policy.{' '}
                              <Link
                                to={'#'}
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(setCancellationPolicyModal(true));
                                }}
                                className="text-primary underline"
                              >
                                Learn more
                              </Link>
                            </p>
                          }
                          className="!p-2"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                          }}
                        />
                      );
                    }}
                  />
                  <menu className="flex items-center gap-6 my-4">
                    {!bookingPaid && (
                      <Button
                        primary={booking?.type === 'booking'}
                        onClick={(e) => {
                          e.preventDefault();
                          createPayment({
                            bookingId: booking?.id,
                            amount: Number(bookingAmount),
                            currency: 'usd',
                            email: booking?.email,
                          });
                        }}
                        disabled={watch('consent') ? false : true}
                      >
                        {createPaymentIsLoading ? (
                          <Loader className="text-primary" />
                        ) : (
                          'Complete payment'
                        )}
                      </Button>
                    )}
                    {booking?.type === 'registration' && (
                      <Button
                        primary
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(
                            submitBookingThunk({
                              id: booking?.id,
                              status: 'pending',
                              totalAmountRwf: booking?.totalAmountRwf,
                              totalAmountUsd: booking?.totalAmountUsd,
                            })
                          );
                        }}
                        disabled={watch('consent') ? false : true}
                      >
                        {submitBookingIsLoading ? (
                          <Loader />
                        ) : (
                          'Submit and pay later'
                        )}
                      </Button>
                    )}
                  </menu>
                </>
              ) : (
                <menu className="w-full flex flex-col gap-4">
                  <p className="text-center text-black font-medium">
                    All payments have been completed for this booking. You can
                    now proceed to the next step.
                  </p>
                  <Button
                    primary
                    className="flex w-fit mx-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        submitBookingThunk({
                          id: booking?.id,
                          status: 'payment_received',
                          totalAmountUsd: booking?.totalAmountUsd,
                          totalAmountRwf: booking?.totalAmountRwf,
                        })
                      );
                    }}
                  >
                    {submitBookingIsLoading ? <Loader /> : 'Continue'}
                  </Button>
                </menu>
              )}
            </>
          ) : (
            <p className="text-center text-black font-medium">
              Please read and accept the cancellation policy to proceed. Click{' '}
              <Link
                to={`/bookings/${booking?.id}/consent`}
                className="text-primary underline"
              >
                here
              </Link>{' '}
              to learn more.
            </p>
          )}
        </menu>
      </main>
    </PublicLayout>
  );
};

export default BookingPreview;
