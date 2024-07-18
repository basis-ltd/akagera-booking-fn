import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import Table from '@/components/table/Table';
import { bookingStatus } from '@/constants/bookings.constants';
import { getBookingStatusColor } from '@/helpers/booking.helper';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import validateInputs from '@/helpers/validations.helper';
import { useLazyFetchBookingsQuery } from '@/states/apiSlice';
import {
  setDraftBookingsList,
  setDraftBookingsModal,
} from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListDraftBookings = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { draftBookingsModal, draftBookingsList } = useSelector(
    (state: RootState) => state.booking
  );

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  // INITIALIZE FETCH BOOKINGS QUERY
  const [
    fetchBookings,
    {
      data: bookingsData,
      error: bookingsError,
      isFetching: bookingsIsFetching,
      isSuccess: bookingsIsSuccess,
      isError: bookingsIsError,
    },
  ] = useLazyFetchBookingsQuery();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    dispatch(setDraftBookingsList([]));
    fetchBookings({
      referenceId: data?.referenceId,
      email: data?.email,
      phone: data?.phone,
      type: data?.type,
    });
  };

  // HANDLE FETCH BOOKINGS RESPONSE
  useEffect(() => {
    if (bookingsIsError) {
      if ((bookingsError as ErrorResponse).status === 500) {
        toast.error('An error occurred while fetching bookings');
      } else {
        toast.error((bookingsError as ErrorResponse)?.data?.message);
      }
    }
    if (bookingsIsSuccess) {
      if (bookingsData?.data?.rows.length === 0) {
        toast.info('No bookings found');
      } else {
        dispatch(setDraftBookingsList(bookingsData?.data?.rows));
      }
    }
  }, [
    bookingsIsError,
    bookingsIsSuccess,
    bookingsData,
    bookingsError,
    dispatch,
  ]);

  // BOOKING SELECT OPTIONS
  const bookingSelectOptions = [
    { label: 'Reference ID', value: 'referenceId' },
    { label: 'Email address', value: 'email' },
    { label: 'Phone number', value: 'phone' },
  ];

  // DRAFT BOOKINGS COLUMNS
  const draftBookingsColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Reference ID',
      accessorKey: 'referenceId',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Added by',
      accessorKey: 'email',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<Booking> }) => (
        <p
          className={`${getBookingStatusColor(
            row?.original?.status
          )} text-[14px] p-1 rounded-md`}
        >
          {capitalizeString(row?.original?.status)}
        </p>
      ),
    },
    {
      header: 'Booking date',
      accessorKey: 'startDate',
      cell: ({ row }: { row: Row<Booking> }) =>
        formatDate(row.original.startDate),
    },
    {
      header: 'Date added',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: Row<Booking> }) =>
        formatDate(row.original.createdAt),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<Booking> }) => {
        return (
          <menu className="flex items-center gap-2">
            {Object.values(bookingStatus)
              ?.filter(
                (status) =>
                  !['approved', 'cash_received', 'confirmed'].includes(status)
              )
              ?.includes(row?.original?.status) && (
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/bookings/${row.original.id}/create`);
                  dispatch(setDraftBookingsModal(false));
                }}
                className="text-[13px] p-2 rounded-md bg-primary text-white transition-all hover:scale-[1.01]"
              >
                Update
              </Link>
            )}
          </menu>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={draftBookingsModal}
      onClose={() => {
        reset({
          type: '',
          selectOption: '',
          referenceId: '',
          email: '',
          phone: '',
        });
        dispatch(setDraftBookingsModal(false));
        dispatch(setDraftBookingsList([]));
      }}
      heading={
        draftBookingsList?.length > 0 && bookingsIsSuccess
          ? ' List of unfinished bookings/registrations'
          : 'Find bookings/registrations in progress to complete'
      }
    >
      <form
        className={`flex flex-col gap-4 w-full ${
          draftBookingsList?.length > 0 ? 'min-w-[55vw]' : 'min-w-[45vw]'
        }`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={`${
            draftBookingsList?.length > 0 && bookingsIsSuccess && 'hidden'
          } w-full flex flex-col gap-4`}
        >
          <Controller
            name="type"
            rules={{
              required: 'Choose the type of booking to find',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Select
                    placeholder="Select type"
                    label="Select type"
                    options={[
                      {
                        label: 'Booking',
                        value: 'booking',
                      },
                      {
                        label: 'Registration',
                        value: 'registration',
                      },
                    ]}
                    required
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                  {errors?.type && (
                    <InputErrorMessage message={errors.type.message} />
                  )}
                </label>
              );
            }}
          />
          {watch('type') && (
            <Controller
              name="selectOption"
              rules={{
                required:
                  'Select the option you will use to find bookings in progress',
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1">
                    <Select
                      placeholder="Select option"
                      label="Select booking retrieval option"
                      options={bookingSelectOptions}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.selectOption && (
                      <InputErrorMessage
                        message={errors.selectOption.message}
                      />
                    )}
                  </label>
                );
              }}
            />
          )}
          <menu className="flex flex-col gap-2 w-full">
            {watch('selectOption') === 'referenceId' && (
              <Controller
                name="referenceId"
                control={control}
                rules={{
                  required:
                    watch('selectOption') === 'referenceId' ||
                    'Enter reference ID to continue',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Reference ID"
                        required
                        placeholder="Enter reference ID"
                        {...field}
                      />
                      {errors?.referenceId && (
                        <InputErrorMessage
                          message={errors.referenceId.message}
                        />
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch('selectOption') === 'email' && (
              <Controller
                name="email"
                control={control}
                rules={{
                  required:
                    watch('selectOption') === 'email' ||
                    'Enter email address to continue',
                  validate: (value) => {
                    if (watch('selectOption') === 'email') {
                      return validateInputs(value, 'email') || 'Invalid email';
                    } else return true;
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Email address"
                        required
                        placeholder="Enter email address"
                        {...field}
                      />
                      {errors?.email && (
                        <InputErrorMessage message={errors.email.message} />
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch('selectOption') === 'phone' && (
              <Controller
                name="phone"
                control={control}
                rules={{
                  required:
                    watch('selectOption') === 'phone' ||
                    'Enter phone number to continue',
                  validate: (value) => {
                    if (watch('selectOption') === 'phone') {
                      return (
                        validateInputs(value, 'tel') || 'Invalid phone number'
                      );
                    } else return true;
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Phone number"
                        required
                        placeholder="Enter phone number"
                        {...field}
                      />
                      {errors?.phone && (
                        <InputErrorMessage message={errors.phone.message} />
                      )}
                    </label>
                  );
                }}
              />
            )}
          </menu>
        </fieldset>

        {bookingsIsSuccess && draftBookingsList?.length > 0 && (
          <section className="flex w-full flex-col gap-3">
            <Table
              columns={draftBookingsColumns as ColumnDef<Booking>[]}
              data={draftBookingsList.map((booking: Booking, index: number) => {
                return {
                  ...booking,
                  no: index + 1,
                  type: capitalizeString(booking.type),
                };
              })}
            />
          </section>
        )}
        <menu className="flex items-center gap3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDraftBookingsList([]));
              dispatch(setDraftBookingsModal(false));
            }}
          >
            Cancel
          </Button>
          {draftBookingsList?.length > 0 && bookingsIsSuccess ? (
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                reset({
                  type: '',
                  selectOption: '',
                  referenceId: '',
                  email: '',
                  phone: '',
                });
                dispatch(setDraftBookingsList([]));
              }}
            >
              Search again
            </Button>
          ) : (
            <Button submit primary>
              {bookingsIsFetching ? <Loader /> : 'Find Booking(s)'}
            </Button>
          )}
        </menu>
      </form>
    </Modal>
  );
};

export default ListDraftBookings;
