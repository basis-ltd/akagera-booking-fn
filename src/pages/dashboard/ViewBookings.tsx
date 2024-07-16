import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { bookingColumns, bookingStatus } from '@/constants/bookings.constants';
import AdminLayout from '@/containers/AdminLayout';
import { capitalizeString } from '@/helpers/strings.helper';
import { useLazyFetchBookingsQuery } from '@/states/apiSlice';
import {
  setBookingsList,
  setPage,
  setSize,
  setTotalCount,
  setTotalPages,
} from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { faInfo, faSearch } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Row } from '@tanstack/react-table';
import { getBookingStatusColor } from '@/helpers/booking.helper';
import Table from '@/components/table/Table';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ViewBookings = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingsList, page, size, totalCount, totalPages } = useSelector(
    (state: RootState) => state.booking
  );
  const [status, setStatus] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(
    moment().format('YYYY-MM-DD')
  );

  // REACT HOOK FORM
  const { control, setValue } = useForm();

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
      size,
      page,
      startDate,
      status,
      type,
    });
  }, [fetchBookings, page, size, startDate, status, type]);

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
      dispatch(setTotalCount(bookingsData?.data?.totalCount));
      dispatch(setTotalPages(bookingsData?.data?.totalPages));
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
  }, [setValue]);

  // BOOKING COLUMNS
  const bookingExtendedColumns = [
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Booking> }) => {
        return (
          <menu className="flex items-center gap-2">
            <CustomTooltip label="Click to manage booking">
              <Link
                to={`/bookings/${row?.original?.id}/details`}
                className="flex items-center gap-2 justify-center text-[13px] min-w-[9vw] rounded-md shadow-sm bg-primary text-white py-1 px-2"
              >
                View details
                <FontAwesomeIcon
                  icon={faInfo}
                  className="text-primary p-[3px] cursor-pointer px-[7px] bg-white rounded-full text-[11px]"
                />
              </Link>
            </CustomTooltip>
          </menu>
        );
      },
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
  ];

  return (
    <AdminLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-6 p-6">
        <h1 className="text-primary text-center uppercase font-semibold text-lg">
          {type ? `${capitalizeString(type)}s` : 'Bookings and Registrations'}{' '}
          scheduled for {startDate || 'the near future'}
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
                    onChange={(e) => {
                      field.onChange(e);
                      setStartDate(moment(String(e)).format('YYYY-MM-DD'));
                    }}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange(null);
                      setStartDate(null);
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
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    {...field}
                    options={['booking', 'registration']?.map((type) => {
                      return {
                        value: type,
                        label: `${capitalizeString(type)}s`,
                      };
                    })}
                    onChange={(e) => {
                      field.onChange(e);
                      setType(e);
                    }}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange({
                        target: {
                          value: null,
                        },
                      });
                      setType(null);
                    }}
                    className="px-1 text-[12px] text-primary"
                    to={'#'}
                  >
                    Reset type
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
                    onChange={(e) => {
                      field.onChange(e);
                      setStatus(e);
                    }}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.onChange({
                        target: {
                          value: null,
                        },
                      });
                      setStatus(null);
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
              page={page}
              size={size}
              totalCount={totalCount}
              totalPages={totalPages}
              setPage={setPage}
              setSize={setSize}
              showFilter={false}
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
