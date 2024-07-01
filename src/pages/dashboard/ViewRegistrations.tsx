import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Table from '@/components/table/Table';
import { bookingStatus } from '@/constants/bookings.constants';
import AdminLayout from '@/containers/AdminLayout';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import { useLazyFetchBookingsQuery } from '@/states/apiSlice';
import { setBookingsList } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ColumnDef, Row } from '@tanstack/react-table';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewRegistrations = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingsList } = useSelector((state: RootState) => state.booking);

  // REACT HOOK FORM
  const { control, watch, setValue } = useForm();

  // NAVIGATION
  const navigate = useNavigate();

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
      type: 'registration',
      startDate:
        watch('startDate') && moment(watch('startDate')).format('YYYY-MM-DD'),
      status: watch('status') || 'pending',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBookings, watch('status'), watch, watch('startDate')]);

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

  // REGISTRATION COLUMNS
  const registrationColumns = [
    {
      header: 'Reference ID',
      accessorKey: 'referenceId',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<Booking> }) => {
        return (
          <p
            className={`px-2 py-1 text-[12px] w-fit rounded-md ${
              row.original.status === 'pending'
                ? 'bg-yellow-600 text-white'
                : row.original.status === 'approved'
                ? 'bg-green-400 text-white'
                : 'bg-red-400 text-white'
            }`}
          >
            {capitalizeString(row.original.status)}
          </p>
        );
      },
    },
    {
      header: 'Date',
      accessorKey: 'startDate',
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
      header: 'Entry Gate',
      accessorKey: 'entryGate',
    },
    {
      header: 'Exit Gate',
      accessorKey: 'exitGate',
    },
    {
      header: 'Notes',
      accessorKey: 'notes',
    },
  ];

  useEffect(() => {
    setValue('status', 'pending');
    setValue('startDate', moment().format('YYYY-MM-DD'));
  }, [setValue]);

  return (
    <AdminLayout>
      <main className="p-4 w-[95%] mx-auto flex flex-col gap-6">
        <h1 className="text-primary text-center uppercase font-semibold text-lg">
          Registrations list
        </h1>
        <section className="grid grid-cols-3 items-start gap-4 w-full">
          <Controller
            name="startDate"
            defaultValue={moment().format('YYYY-MM-DD')}
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
            name="createdBy"
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    placeholder="Email or phone"
                    suffixIcon={faSearch}
                    suffixIconPrimary
                    {...field}
                  />
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      field.value = null;
                    }}
                    className="px-1 text-[12px] text-primary"
                    to={'#'}
                  >
                    Clear
                  </Link>
                </label>
              );
            }}
          />
        </section>
        {bookingsIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[30vh]">
            <Loader className="text-primary" />
          </figure>
        ) : bookingsIsSuccess && bookingsList?.length > 0 ? (
          <section className="w-full flex flex-col gap-3">
            <Table
            rowClickHandler={(row) => {
              navigate(`/bookings/${row?.id}/details`)
            }}
              showFilter={false}
              showPagination={false}
              data={bookingsList?.map((registration: Booking) => {
                return {
                  ...registration,
                  startDate: formatDate(registration?.startDate),
                  entryGate: capitalizeString(registration?.entryGate),
                  exitGate: capitalizeString(registration?.exitGate),
                };
              })}
              columns={registrationColumns as ColumnDef<Booking>[]}
            />
          </section>
        ) : (
          <figure className="w-full flex items-center justify-center min-h-[30vh]">
            <p className="text-lg text-gray-400">No registrations found.</p>
          </figure>
        )}
      </main>
    </AdminLayout>
  );
};

export default ViewRegistrations;
