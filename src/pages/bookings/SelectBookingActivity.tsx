import Button from '@/components/inputs/Button';
import Modal from '@/components/modals/Modal';
import { formatDate } from '@/helpers/strings.helper';
import { setSelectBookingActivityModal } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import {
  useCreateBookingActivityMutation,
  useLazyFetchBookingActivitiesQuery,
} from '@/states/apiSlice';
import { ErrorResponse } from 'react-router-dom';
import {
  addBookingActivity,
  setDeleteBookingActivityModal,
  setExistingBookingActivitiesList,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import Loader from '@/components/inputs/Loader';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '@/components/inputs/Select';
import { setSelectedBookingPeople } from '@/states/features/bookingPeopleSlice';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { formatTime } from '@/helpers/strings.helper';
import moment from 'moment';
import Input from '@/components/inputs/Input';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import Table from '@/components/table/Table';
import { validatePersonAgeRange } from '@/helpers/validations.helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivityRate } from '@/types/models/activityRate.types';

const SelectBookingActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectBookingActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { existingBookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const [bookingActivity, setBookingActivity] = useState<{
    startTime: Date | undefined | string;
    bookingId: UUID;
    activityId: UUID | string;
    endTime?: Date | undefined | string;
  }>({
    startTime: booking?.startDate,
    bookingId: booking?.id,
    activityId: selectedActivity?.id,
    endTime: booking?.endDate,
  });
  const [selectedActivitySchedule, setSelectedActivitySchedule] = useState<
    ActivitySchedule | undefined
  >(undefined);
  const [transportationsLabel, setTransportationsLabel] = useState<string>('transportations');

  // REACT HOOK FORM
  const {
    control,
    reset,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // INITIALIZE CREATE BOOKING ACTIVITY MUTATION
  const [
    createBookingActivity,
    {
      isLoading: createBookingActivityIsLoading,
      error: createBookingActivityError,
      data: createdBookingActivityData,
      isError: createBookingActivityIsError,
      isSuccess: createBookingActivityIsSuccess,
    },
  ] = useCreateBookingActivityMutation();

  // INITIALIZE FETCHING BOOKING ACTIVITIES QUERY
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

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    if (booking) {
      fetchBookingActivities({
        bookingId: booking?.id,
        take: 100,
        skip: 0,
        activityId: selectedActivity?.id,
      });
    }
  }, [
    booking,
    fetchBookingActivities,
    selectedActivity,
    selectBookingActivityModal,
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
      dispatch(
        setExistingBookingActivitiesList(bookingActivitiesData?.data?.rows)
      );
    }
  }, [
    bookingActivitiesIsSuccess,
    bookingActivitiesIsError,
    bookingActivitiesData,
    bookingActivitiesError,
    dispatch,
  ]);

  // HANDLE CREATE BOOKING ACTIVITY RESPONSE
  useEffect(() => {
    if (createBookingActivityIsError) {
      if ((createBookingActivityError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while adding activity to booking');
      } else {
        toast.error(
          (createBookingActivityError as ErrorResponse)?.data?.message
        );
      }
    } else if (createBookingActivityIsSuccess) {
      toast.success('Activity added to booking successfully');
      dispatch(addBookingActivity(createdBookingActivityData?.data));
      dispatch(setSelectedBookingPeople([]));
      reset({
        selectedBookingPeople: null,
      });
      dispatch(setSelectBookingActivityModal(false));
      setSelectedActivitySchedule(undefined);
      reset({
        activitySchedule: '',
        numberOfAdults: '',
        numberOfChildren: '',
      });
    }
  }, [
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
    createBookingActivityError,
    dispatch,
    createdBookingActivityData?.data,
    reset,
  ]);

  const onSubmit = (data: FieldValues) => {
    createBookingActivity({
      bookingId: booking?.id,
      activityId: selectedActivity?.id,
      startTime: bookingActivity?.startTime || booking?.startDate,
      endTime: bookingActivity?.endTime || booking?.endDate,
      numberOfAdults: data?.numberOfAdults ? Number(data?.numberOfAdults) : 0,
      numberOfChildren:
        data?.numberOfChildren ? Number(data?.numberOfChildren) : 0,
      numberOfSeats: data?.numberOfSeats && Number(data?.numberOfSeats),
      defaultRate: data?.defaultRate ? Number(data?.defaultRate) : null,
    });
  };

  // EXISTING BOOKING ACTIVITIES COLUMNS
  const existingBookingActivitiesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Time',
      accessorKey: 'time',
    },
    {
      header: 'Number of adults',
      accessorKey: 'numberOfAdults',
    },
    {
      header: 'Number of children',
      accessorKey: 'numberOfChildren',
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

  useEffect(() => {
    switch (selectedActivity?.name?.toUpperCase()) {
      case 'BOAT TRIP – PRIVATE, NON-SCHEDULED':
        setTransportationsLabel('participants');
        break;
      case 'GUIDE FOR SELF-DRIVE GAME DRIVE':
        setTransportationsLabel('guides');
        break;
      default:
        setTransportationsLabel('transportations');
        break;
    }
  }, [selectedActivity?.name, selectedActivitySchedule]);

  return (
    <Modal
      isOpen={selectBookingActivityModal}
      onClose={() => {
        dispatch(setSelectBookingActivityModal(false));
        setSelectedActivitySchedule(undefined);
        reset({
          activitySchedule: '',
          numberOfAdults: '',
          numberOfChildren: '',
        });
      }}
      heading={`Confirm adding ${selectedActivity.name} to "${
        booking?.name
      } - ${formatDate(booking?.startDate)}"?`}
    >
      {bookingActivitiesIsFetching ? (
        <figure className="w-full min-h-[20vh] flex flex-col gap-2 items-center justify-center">
          <Loader className="text-primary" />
          <p className="text-[15px]">
            Retrieving existing bookings for this activity
          </p>
        </figure>
      ) : existingBookingActivitiesList?.length <= 0 ? (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid grid-cols-2 gap-2 w-full">
            <Controller
              name="startDate"
              control={control}
              defaultValue={booking?.startDate as Date}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      fromDate={booking?.startDate}
                      toDate={booking?.endDate}
                      type="date"
                      label="Date for this activity"
                      required
                      {...field}
                      defaultValue={booking?.startDate}
                    />
                  </label>
                );
              }}
            />
            {selectedActivity?.activitySchedules &&
              selectedActivity?.activitySchedules?.length > 0 && (
                <Controller
                  name="activitySchedule"
                  control={control}
                  rules={{ required: 'Select from available schedules' }}
                  render={({ field }) => {
                    return (
                      <label className="flex w-full flex-col gap-1">
                        <Select
                          label="Select time slot for this activity"
                          {...field}
                          required
                          onChange={(e) => {
                            field.onChange(e);
                            setSelectedActivitySchedule(
                              selectedActivity?.activitySchedules?.find(
                                (activitySchedule: ActivitySchedule) =>
                                  `${activitySchedule.startTime}-${activitySchedule.endTime}` ===
                                  e
                              )
                            );
                            setBookingActivity({
                              ...bookingActivity,
                              startTime: moment(
                                `${formatDate(booking?.startDate)}T${
                                  e?.split('-')[0]
                                }`
                              ).format(),
                              endTime: moment(
                                `${formatDate(booking?.startDate)}T${
                                  e?.split('-')[1]
                                }`
                              ).format(),
                            });
                          }}
                          options={selectedActivity?.activitySchedules?.map(
                            (activitySchedule: ActivitySchedule) => {
                              const label = `${formatTime(
                                activitySchedule.startTime
                              )} - ${formatTime(
                                String(activitySchedule.endTime)
                              )}`;
                              return {
                                label: activitySchedule?.description
                                  ? `${activitySchedule?.description} (${label})`
                                  : label,
                                value: `${activitySchedule.startTime}-${activitySchedule.endTime}`,
                              };
                            }
                          )}
                        />
                        {errors?.activitySchedule && (
                          <InputErrorMessage
                            message={errors?.activitySchedule?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
              )}

            {selectedActivity?.activityRates?.find(
              (rate: ActivityRate) => rate?.ageRange === 'children'
            ) !== undefined ? (
              <>
                <Controller
                  name="numberOfAdults"
                  control={control}
                  rules={{
                    required: 'Enter number of adult participants',
                    validate: (value) => {
                      return (
                        validatePersonAgeRange(
                          Number(value),
                          booking?.bookingPeople || [],
                          'adults'
                        ) || 'Add people who have 13 years or more.'
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          {...field}
                          type="number"
                          label="Number of adult participants"
                          required
                          onChange={async (e) => {
                            field.onChange(e.target.value);
                            await trigger('numberOfAdults');
                          }}
                        />
                        {errors?.numberOfAdults && (
                          <InputErrorMessage
                            message={errors?.numberOfAdults?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />

                <Controller
                  name="numberOfChildren"
                  control={control}
                  rules={{
                    required: 'Enter number of children participants',
                    validate: (value) => {
                      return (
                        validatePersonAgeRange(
                          Number(value),
                          booking?.bookingPeople || [],
                          'children'
                        ) || 'Add people who have 6 - 12 years old only.'
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          {...field}
                          type="number"
                          label="Number of children participants"
                          required
                          onChange={async (e) => {
                            field.onChange(e.target.value);
                            await trigger('numberOfChildren');
                          }}
                        />
                        {errors?.numberOfChildren && (
                          <InputErrorMessage
                            message={errors?.numberOfChildren?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
              </>
            ) : selectedActivity?.name?.toUpperCase() ===
              'BOAT TRIP – PRIVATE, NON-SCHEDULED' ? (
              <>
                <Controller
                  name="numberOfParticipants"
                  control={control}
                  rules={{
                    required:
                      'Enter the number of participants for this boat trip',
                    validate: (value) => {
                      if (Number(value) < 1) {
                        return 'Number of participants must be greater than 0';
                      }
                      if (Number(value) > 29) {
                        return 'Number of participants cannot exceed 29 for one booking. Please create another booking for the remaining participants.';
                      }
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          type="number"
                          {...field}
                          label="Number of participants"
                          required
                          onChange={async (e) => {
                            field.onChange(e.target.value);
                            if (Number(e.target.value) <= 11) {
                              setValue('defaultRate', 200);
                            } else if (Number(e.target.value) <= 18) {
                              setValue('defaultRate', 360);
                            } else if (Number(e.target.value) <= 29) {
                              setValue('defaultRate', 560);
                            }
                            await trigger('numberOfParticipants');
                          }}
                        />
                        {errors?.numberOfParticipants && (
                          <InputErrorMessage
                            message={errors?.numberOfParticipants?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
              </>
            ) : (
              <>
                <Controller
                  name="numberOfSeats"
                  defaultValue={1}
                  control={control}
                  rules={{
                    required: 'Specify the number of transportations',
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-2">
                        <Input
                          {...field}
                          type="number"
                          label={`Number of ${transportationsLabel}`}
                          required
                        />
                        {errors?.numberOfSeats && (
                          <InputErrorMessage
                            message={errors?.numberOfSeats?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
                <Controller
                  name="defaultRate"
                  control={control}
                  rules={{
                    required: 'Select your preferred pricing option',
                  }}
                  render={({ field }) => {
                    return (
                      <label className="flex flex-col gap-2">
                        <Select
                          {...field}
                          label="Select pricing option"
                          required
                          options={selectedActivity?.activityRates?.map(
                            (rate: ActivityRate) => {
                              return {
                                label: rate?.name,
                                value: String(rate?.amountUsd),
                              };
                            }
                          )}
                        />
                        {errors?.defaultRate && (
                          <InputErrorMessage
                            message={errors?.defaultRate?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
              </>
            )}
          </fieldset>
          <menu className="flex flex-col gap-2 w-[90%]">
            {selectedActivitySchedule &&
              selectedActivitySchedule?.numberOfSeats !== 1000 && (
                <p className="text-slate-900 text-[15px]">
                  Number of transportations available for this period:{' '}
                  {selectedActivitySchedule?.numberOfSeats}
                </p>
              )}
            {selectedActivitySchedule &&
              selectedActivitySchedule?.disclaimer && (
                <p className="text-slate-900 text-[15px]">
                  Disclaimer: {selectedActivitySchedule?.disclaimer}
                </p>
              )}
            {watch('numberOfParticipants') &&
              Number(watch('numberOfParticipants')) >= 1 &&
              Number(watch('numberOfParticipants')) <= 29 && (
                <p className="text-slate-900 text-[15px]">
                  Price: ${watch('defaultRate')} USD
                </p>
              )}
          </menu>

          <menu className="flex items-center gap-3 justify-between mt-3">
            <Button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectBookingActivityModal(false));
                setSelectedActivitySchedule(undefined);
              }}
              danger
            >
              Cancel
            </Button>
            <Button className="btn btn-primary" submit primary>
              {createBookingActivityIsLoading ? <Loader /> : 'Confirm'}
            </Button>
          </menu>
        </form>
      ) : (
        <article className="w-full flex flex-col gap-3">
          <p className="text-[15px]">
            This activity has been added to this booking.
          </p>
          <Table
            showFilter={false}
            showPagination={false}
            columns={
              existingBookingActivitiesColumns as ColumnDef<BookingActivity>[]
            }
            data={existingBookingActivitiesList?.map(
              (bookingActivity: BookingActivity, index: number) => {
                return {
                  ...bookingActivity,
                  no: index + 1,
                  date: formatDate(bookingActivity?.startTime),
                  time: `${moment(bookingActivity?.startTime).format(
                    'HH:mm A'
                  )} - 
                      ${moment(bookingActivity?.endTime).format('HH:mm A')}`,
                };
              }
            )}
          />
          <ul className="flex items-center gap-3 w-full justify-between">
            <Button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectBookingActivityModal(false));
                setSelectedActivitySchedule(undefined);
                reset({
                  activitySchedule: '',
                  numberOfAdults: '',
                  numberOfChildren: '',
                });
              }}
            >
              Close
            </Button>
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setExistingBookingActivitiesList([]));
              }}
            >
              Book again
            </Button>
          </ul>
        </article>
      )}
    </Modal>
  );
};

export default SelectBookingActivity;
