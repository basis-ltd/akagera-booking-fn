import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import Table from '@/components/table/Table';
import { bookingActivitiesColumns } from '@/constants/bookingActivity.constants';
import { formatDate, formatTime } from '@/helpers/strings.helper';
import { validatePersonAgeRange } from '@/helpers/validations.helper';
import {
  calculateRemainingSeatsThunk,
  setRemainingSeats,
} from '@/states/features/activityScheduleSlice';
import {
  setAddCampingActivitiesModal,
  setSelectBookingActivityModal,
} from '@/states/features/activitySlice';
import {
  createBookingActivityThunk,
  setDeleteBookingActivityModal,
  setExistingBookingActivitiesList,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const AddCampingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addCampingActivitiesModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const {
    createBookingActivityIsLoading,
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
    existingBookingActivitiesList,
    existingBookingActivitiesIsFetching,
    existingBookingActivitiesIsSuccess,
  } = useSelector((state: RootState) => state.bookingActivity);
  const [selectedActivitySchedule, setSelectedActivitySchedule] = useState<
    ActivitySchedule | undefined
  >(undefined);
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
  const { remainingSeats, remainingSeatsIsFetching } = useSelector(
    (state: RootState) => state.activitySchedule
  );

  // REACT HOOK FORM
  const {
    control,
    reset,
    handleSubmit,
    trigger,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    if (!data?.numberOfChildren && !data?.numberOfAdults) {
      setError('numberOfParticipants', {
        type: 'manual',
        message: 'Add at least one participant',
      });
      return;
    }
    dispatch(
      createBookingActivityThunk({
        numberOfAdults: data?.numberOfAdults,
        numberOfChildren: data?.numberOfChildren,
        numberOfSeats: data?.numberOfSeats,
        activityId: selectedActivity?.id,
        bookingId: booking?.id,
        startTime: bookingActivity?.startTime,
        endTime: bookingActivity?.endTime,
      })
    );
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startDate', booking?.startDate);
  }, [booking, selectedActivity, setValue]);

  // EXISTING BOOKING ACTIVITIES COLUMNS
  const existingBookingActivitiesColumns = [
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

  // HANDLE CREATE BOOKING ACTIVITY RESPONSE
  useEffect(() => {
    if (createBookingActivityIsError) {
      if (createBookingActivityIsError) {
        toast.error(
          'An error occured while creating booking activity. Please try again later.'
        );
      }
    } else if (createBookingActivityIsSuccess) {
      dispatch(setAddCampingActivitiesModal(false));
      reset({
        startDate: booking?.startDate,
        activitySchedule: '',
        numberOfAdults: '',
        numberOfChildren: '',
        numberOfSeats: '',
      });
    }
  }, [
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
    dispatch,
    reset,
    booking?.startDate,
    selectedActivity?.slug,
  ]);

  // GET REMAINING SEATS FOR ACTIVITY SCHEDULE
  useEffect(() => {
    if (selectedActivitySchedule) {
      dispatch(
        calculateRemainingSeatsThunk({
          id: selectedActivitySchedule?.id,
          date: watch('startDate'),
        })
      );
    }
  }, [selectedActivitySchedule, dispatch, watch, watch('startDate')]);

  return (
    <Modal
      isOpen={addCampingActivitiesModal}
      onClose={() => {
        dispatch(setAddCampingActivitiesModal(false));
      }}
      heading={`Add ${selectedActivity?.name}`}
      className="min-w-[60vw]"
    >
      {existingBookingActivitiesIsFetching ? (
        <figure className="w-full min-h-[20vh] flex flex-col gap-2 items-center justify-center">
          <Loader className="text-primary" />
          <p className="text-[15px]">
            Retrieving existing bookings for this activity
          </p>
        </figure>
      ) : existingBookingActivitiesList?.length <= 0 &&
        existingBookingActivitiesIsSuccess ? (
        <form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid grid-cols-2 gap-5 w-full">
            <Controller
              name="startDate"
              control={control}
              defaultValue={booking?.startDate}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      fromDate={booking?.startDate}
                      toDate={booking?.endDate}
                      type="date"
                      label="Start date for this activity"
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
                            setSelectedActivitySchedule(
                              selectedActivity?.activitySchedules?.find(
                                (activitySchedule: ActivitySchedule) =>
                                  `${activitySchedule.startTime}-${activitySchedule.endTime}` ===
                                  e
                              )
                            );
                          }}
                          options={selectedActivity?.activitySchedules?.map(
                            (activitySchedule: ActivitySchedule) => {
                              const label = `${formatTime(
                                activitySchedule.startTime
                              )} - ${formatTime(
                                String(activitySchedule.endTime)
                              )}`;
                              return {
                                label,
                                value: `${activitySchedule.startTime}-${activitySchedule.endTime}`,
                              };
                            }
                          )}
                        />
                        {field?.value && remainingSeatsIsFetching ? (
                          <figure className="flex items-center gap-2">
                            <p className="text-[12px]">
                              Calculating available tents
                            </p>
                            <Loader className="text-primary" />
                          </figure>
                        ) : remainingSeats &&
                          (remainingSeats as boolean) !== true ? (
                          <p className="text-[13px] my-1 px-1 font-medium text-primary">
                            Number of tents available for this period:{' '}
                            {remainingSeats}
                          </p>
                        ) : (
                          field?.value && (
                            <p className="text-[13px] my-1 px-1 font-medium text-primary">
                              This period is available bookings.
                            </p>
                          )
                        )}
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
            <Controller
              name="numberOfAdults"
              control={control}
              rules={{
                validate: (value) => {
                  if (!value) return true;
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
                        clearErrors('numberOfParticipants');
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
                validate: (value) => {
                  if (!value) return true;
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
                        clearErrors('numberOfParticipants');
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
            <Controller
              name="numberOfNights"
              control={control}
              rules={{
                required: 'Enter number of nights',
                validate: (value) => {
                  if (value === 0) {
                    return 'Number of nights cannot be zero';
                  }
                  return (
                    Number(value) <=
                      moment(booking?.endDate).diff(
                        booking?.startDate,
                        'days'
                      ) || 'Number of nights cannot exceed booking nights'
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      {...field}
                      type="number"
                      label="Number of nights"
                      required
                      onChange={async (e) => {
                        field.onChange(e.target.value);
                        setBookingActivity({
                          ...bookingActivity,
                          endTime: moment(bookingActivity?.startTime)
                            .add(Number(e?.target?.value), 'days')
                            .format(),
                        });
                        await trigger('numberOfNights');
                      }}
                    />
                    {errors?.numberOfNights && (
                      <InputErrorMessage
                        message={errors?.numberOfNights?.message}
                      />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="numberOfSeats"
              control={control}
              rules={{ required: 'Number of tents is required' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      {...field}
                      type="number"
                      label="Number of tents"
                      required
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        clearErrors('numberOfParticipants');
                        if (Number(e?.target?.value) > Number(remainingSeats)) {
                          setError('numberOfParticipants', {
                            type: 'manual',
                            message:
                              'Number of tents exceeds available tents for this period',
                          });
                        }
                      }}
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
          </fieldset>
          {Object.keys(errors)?.length > 0 && (
            <menu className="w-full flex flex-col gap-2">
              {errors?.numberOfParticipants && (
                <InputErrorMessage
                  message={errors?.numberOfParticipants?.message}
                />
              )}
            </menu>
          )}
          <menu className="w-full flex items-center gap-3 justify-between">
            <Button
              onClick={(e) => {
                e.preventDefault();
                reset({
                  startDate: booking?.startDate,
                  activitySchedule: '',
                });
                dispatch(setAddCampingActivitiesModal(false));
              }}
            >
              Cancel
            </Button>
            <Button primary submit disabled={Object.keys(errors)?.length > 0}>
              {createBookingActivityIsLoading ? <Loader /> : 'Add activity'}
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
                dispatch(setRemainingSeats(0));
                reset({
                  activitySchedule: '',
                  defaultRate: '',
                  numberOfAdults: '',
                  numberOfChildren: '',
                  numberOfParticipants: '',
                  numberOfSeats: 0,
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

export default AddCampingActivities;