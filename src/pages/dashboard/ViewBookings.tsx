import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { bookingColumns, bookingStatus } from '@/constants/bookings.constants';
import AdminLayout from '@/containers/AdminLayout';
import { capitalizeString, formatCurrency, formatDate } from '@/helpers/strings.helper';
import {
  useLazyFetchBookingsQuery,
} from '@/states/apiSlice';
import { setBookingsList } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Row } from '@tanstack/react-table';
import { getBookingStatusColor } from '@/helpers/booking.helper';
import Table from '@/components/table/Table';

const ViewBookings = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingsList } = useSelector((state: RootState) => state.booking);

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const { control, watch, setValue } = useForm();

  // INITIALIZE FETCH BOOKINGS QUERY
  const [
    fetchBookings,
    {
      data: bookingsData,
      error: bookingsError,
      isFetching: bookingsIsFetching,
      isError: bookingsIsError,
      isSuccess: bookingsIsSuccess,
    },
  ] = useLazyFetchBookingsQuery();

  // FETCH BOOKINGS
  useEffect(() => {
    fetchBookings({
      take: 100,
      skip: 0,
      startDate:
        watch('startDate') && moment(watch('startDate')).format('YYYY-MM-DD'),
      status: watch('status'),
      type: 'booking',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBookings, watch('startDate'), watch('status')]);

  // HANDLE FETCH BOOKINGS RESPONSE
  useEffect(() => {
    if (bookingsIsError) {
      dispatch(setBookingsList([]));
      if ((bookingsError as ErrorResponse)?.status === 500) {
        toast.error('Failed to fetch bookings. Please try again later.');
      } else {
        toast.error((bookingsError as ErrorResponse)?.data?.message);
      }
    } else if (bookingsIsSuccess) {
      dispatch(setBookingsList(bookingsData?.data?.rows));
    }
  }, [
    bookingsData,
    bookingsError,
    bookingsIsError,
    bookingsIsSuccess,
    dispatch,
  ]);

  useEffect(() => {
    setValue('startDate', moment().format());
  }, [setValue])

  // BOOKING COLUMNS
  const bookingExtendedColumns = [
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: ({ row }: { row: Row<Booking> }) => (
        <p className="text-[14px] font-semibold">
          {formatCurrency(row?.original?.totalAmountUsd)} |{' '}
          {formatCurrency(row.original.totalAmountRwf, 'RWF')}
        </p>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<Booking> }) => {
        return (
          <p
            className={`px-2 py-1 text-[12px] w-fit rounded-md ${getBookingStatusColor(
              row?.original?.status
            )}`}
          >
            {capitalizeString(row.original.status)}
          </p>
        );
      },
    },
    ...bookingColumns,
  ]

  return (
    <AdminLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-6 p-6">
        <h1 className="text-primary text-center uppercase font-semibold text-lg">
          Bookings scheduled for{' '}
          {watch('startDate')
            ? formatDate(watch('startDate'))
            : moment().format('dddd, MMMM Do YYYY')}
        </h1>
        <section className="grid grid-cols-4 items-start gap-4">
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    className="w-fit"
                    type="date"
                    placeholder="Select day"
                    {...field}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange(null);
                    }}
                    className="px-1 text-[12px] text-primary"
                    to={'#'}
                  >
                    Reset date
                  </Link>
                </label>
              );
            }}
          />
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    {...field}
                    placeholder="Status"
                    options={Object.values(bookingStatus).map((status) => ({
                      label: capitalizeString(status),
                      value: status,
                    }))}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange({
                        target: {
                          value: null,
                        },
                      });
                    }}
                    className="px-1 text-[12px] text-primary"
                    to={'#'}
                  >
                    Reset status
                  </Link>
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="referenceId"
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    placeholder="Reference ID"
                    suffixIcon={faSearch}
                    suffixIconPrimary
                    suffixIconHandler={(e) => {
                      e.preventDefault();
                      fetchBookings({
                        referenceId: field.value,
                      });
                    }}
                    {...field}
                  />
                </label>
              );
            }}
          />
        </section>
        {bookingsIsFetching ? (
          <figure className="w-full flex justify-center items-center min-h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-4">
            <Table
              rowClickHandler={(row) => {
                navigate(`/bookings/${row?.id}/details`);
              }}
              showFilter={false}
              showPagination={false}
              data={bookingsList}
              columns={bookingExtendedColumns}
            />
          </section>
        )}
      </main>
    </AdminLayout>
  );
};

export default ViewBookings;
