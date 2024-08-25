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
import { setAddBoatTripMorningDayActivityModal } from '@/states/features/activitySlice';
import {
  createBookingActivityThunk,
  fetchBookingActivitiesThunk,
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

const AddBoatTripMorningDayActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addBoatTripMorningDayActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const { remainingSeats, remainingSeatsIsFetching } = useSelector(
    (state: RootState) => state.activitySchedule
  );
  const {
    createBookingActivityIsLoading,
    createBookingActivityIsSuccess,
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

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setError,
    clearErrors,
    setValue,
    getValues,
  } = useForm();

  const { startDate, numberOfAdults, numberOfChildren } = getValues();

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startDate', booking?.startDate);
  }, [booking, selectedActivity, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    if (!data?.numberOfAdults && !data?.numberOfChildren) {
      setError('numberOfParticipants', {
        type: 'manual',
        message: 'Please add at least one participant.',
      });
      return;
    }
    dispatch(
      createBookingActivityThunk({
        numberOfAdults: Number(data?.numberOfAdults),
        numberOfChildren: Number(data?.numberOfChildren),
        bookingId: booking?.id,
        activityId: selectedActivity?.id,
        startTime: bookingActivity?.startTime,
        endTime: bookingActivity?.endTime,
      })
    );
  };

  // GET REMAINING SEATS FOR ACTIVITY SCHEDULE
  useEffect(() => {
    if (selectedActivitySchedule) {
      dispatch(
        calculateRemainingSeatsThunk({
          id: selectedActivitySchedule?.id,
          date: startDate || booking?.startDate,
        })
      );
    }
  }, [selectedActivitySchedule, dispatch, booking?.startDate, startDate]);

  // HANDLE CREATE BOOKING ACTIVITY RESPONSE
  useEffect(() => {
    if (
      createBookingActivityIsSuccess &&
      selectedActivity?.slug === 'boat-trip-morning-day'
    ) {
      dispatch(setAddBoatTripMorningDayActivityModal(false));
      reset({
        activitySchedule: '',
        numberOfAdults: '',
        numberOfChildren: '',
        numberOfParticipants: '',
      });
    }
  }, [createBookingActivityIsSuccess, dispatch, reset, selectedActivity?.slug]);

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

  // FETCH EXISTING BOOKING ACTIVITIES
  useEffect(() => {
    if (addBoatTripMorningDayActivityModal) {
      dispatch(
        fetchBookingActivitiesThunk({
          activityId: selectedActivity?.id,
          page: 0,
          size: 100,
          bookingId: booking?.id,
        })
      );
    }
  }, [booking?.id, dispatch, selectedActivity?.id, addBoatTripMorningDayActivityModal]);

  // VALIDATE PARTICIPANTS AGAINST REMAINING SEATS
  useEffect(() => {
    if (remainingSeats && remainingSeats !== true) {
      const totalParticipants =
        Number(numberOfAdults || 0) + Number(numberOfChildren || 0);
      if (totalParticipants > remainingSeats) {
        setError('remainingSeats', {
          type: 'manual',
          message: 'Number of participants exceeds remaining seats.',
        });
      } else {
        clearErrors('remainingSeats');
      }
    }
  }, [remainingSeats, numberOfAdults, numberOfChildren, setError, clearErrors]);

  return (
    <Modal
      isOpen={addBoatTripMorningDayActivityModal}
      onClose={() => {
        dispatch(setAddBoatTripMorningDayActivityModal(false));
      }}
      heading={`Add Boat Trip Morning Day Activity`}
      className="min-w-[60%]"
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
                        {selectedActivitySchedule &&
                        remainingSeatsIsFetching ? (
                          <figure className="flex items-center gap-2">
                            <p className="text-[12px]">
                              Calculating available seats
                            </p>
                            <Loader className="text-primary" />
                          </figure>
                        ) : remainingSeats &&
                          (remainingSeats as boolean) !== true ? (
                          <p className="text-[13px] my-1 px-1 font-medium text-primary">
                            Number of seats available for this period:{' '}
                            {remainingSeats}
                          </p>
                        ) : (
                          selectedActivitySchedule && (
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
          </fieldset>
          {Object.keys(errors)?.length > 0 && (
            <menu className="w-full flex flex-col gap-2">
              {errors?.numberOfParticipants && (
                <InputErrorMessage
                  message={errors?.numberOfParticipants?.message}
                />
              )}
              {errors?.remainingSeats && (
                <InputErrorMessage
                  message={errors?.remainingSeats?.message}
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
                dispatch(setAddBoatTripMorningDayActivityModal(false));
              }}
            >
              Cancel
            </Button>
            <Button primary submit>
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
                dispatch(setAddBoatTripMorningDayActivityModal(false));
                setSelectedActivitySchedule(undefined);
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

export default AddBoatTripMorningDayActivity;