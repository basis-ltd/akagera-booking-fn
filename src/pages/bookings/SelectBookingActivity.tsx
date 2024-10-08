import Button from '@/components/inputs/Button';
import Modal from '@/components/modals/Modal';
import { formatDate } from '@/helpers/strings.helper';
import { setSelectBookingActivityModal } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { useCreateBookingActivityMutation } from '@/states/apiSlice';
import { ErrorResponse } from 'react-router-dom';
import {
  addBookingActivity,
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
import { validatePersonAgeRange } from '@/helpers/validations.helper';
import { ActivityRate } from '@/types/models/activityRate.types';
import { calculateBehindTheScenesPrice } from '@/helpers/bookingActivity.helper';
import {
  calculateRemainingSeatsThunk,
  setRemainingSeats,
} from '@/states/features/activityScheduleSlice';
import TemporaryBookingActivityPrice from './booking-activities/TemporaryBookingActivityPrice';

const SelectBookingActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectBookingActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { remainingSeats, remainingSeatsIsFetching } = useSelector(
    (state: RootState) => state.activitySchedule
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
  const [transportationsLabel, setTransportationsLabel] =
    useState<string>('seats');
  const [minNumberOfSeatsDisclaimer, setMinNumberOfSeatsDisclaimer] =
    useState<string>('');

  // REACT HOOK FORM
  const {
    control,
    reset,
    handleSubmit,
    trigger,
    watch,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    numberOfChildren,
    numberOfAdults,
    numberOfParticipants,
    numberOfSeats,
    startDate,
  } = watch();

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
      dispatch(setRemainingSeats(0));
      reset({
        activitySchedule: '',
        defaultRate: '',
        numberOfAdults: '',
        numberOfChildren: '',
        numberOfParticipants: '',
        numberOfSeats: 0,
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
    if (
      !data?.numberOfAdults &&
      !data?.numberOfChildren &&
      !data?.numberOfSeats
    ) {
      setError('numberOfParticipants', {
        type: 'manual',
        message: 'Please add at least one participant.',
      });
      return;
    }
    createBookingActivity({
      bookingId: booking?.id,
      activityId: selectedActivity?.id,
      startTime: bookingActivity?.startTime || booking?.startDate,
      endTime: data?.numberOfNights
        ? moment(bookingActivity?.startTime).add(
            Number(data?.numberOfNights),
            'days'
          )
        : bookingActivity?.endTime || booking?.endDate,
      numberOfAdults: data?.numberOfAdults ? Number(data?.numberOfAdults) : 0,
      numberOfChildren: data?.numberOfChildren
        ? Number(data?.numberOfChildren)
        : 0,
      numberOfSeats: data?.numberOfSeats
        ? Number(data?.numberOfSeats)
        : data?.numberOfParticipants
        ? Number(data?.numberOfParticipants)
        : 0,
      defaultRate: data?.defaultRate
        ? Number(data?.defaultRate)
        : selectedActivity?.name
            ?.toUpperCase()
            ?.includes('BEHIND THE SCENES TOUR')
        ? calculateBehindTheScenesPrice({
            numberOfAdults: Number(data?.numberOfAdults) || 0,
            numberOfChildren: Number(data?.numberOfChildren) || 0,
          })
        : null,
    });
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
  }, [
    selectedActivitySchedule,
    dispatch,
    booking?.startDate,
    watch,
    startDate,
  ]);

  useEffect(() => {
    switch (selectedActivity?.name?.toUpperCase()) {
      case 'BOAT TRIP – PRIVATE, NON-SCHEDULED':
        setTransportationsLabel('participants');
        break;
      case 'GUIDES FOR SELF-DRIVE':
      case 'BOAT TRIP – SCHEDULED SUNSET TRIP':
        setTransportationsLabel('guides');
        break;
      case 'GAME DRIVE DAY (AMC OPERATED)':
        setTransportationsLabel('cars');
        break;
      case 'BOAT TRIP – SCHEDULED MORNING/DAY':
        setTransportationsLabel('seats');
        break;
      default:
        setTransportationsLabel('seats');
        break;
    }
    if (selectedActivity?.name?.toUpperCase()?.includes('CAMPING')) {
      setTransportationsLabel('tents');
    }
  }, [selectedActivity?.name, selectedActivitySchedule]);

  // VALIDATE NUMBER OF PARTICIPANTS AGAINST MIN AND MAX
  useEffect(() => {
    clearErrors('numberOfParticipants');
    clearErrors('numberOfSeats');
    setMinNumberOfSeatsDisclaimer('');
    if (selectedActivitySchedule?.minNumberOfSeats) {
      if (
        Number(watch('numberOfParticipants')) <
        selectedActivitySchedule?.minNumberOfSeats
      ) {
        setMinNumberOfSeatsDisclaimer(
          'For this activity, minimum number of participants is ' +
            selectedActivitySchedule?.minNumberOfSeats +
            '. If you enter a number less than this, you will be charged for the minimum number of participants.'
        );
      }
      if (
        Number(watch('numberOfAdults') || 0) +
          Number(watch('numberOfChildren') || 0) <
        selectedActivitySchedule?.minNumberOfSeats
      ) {
        setMinNumberOfSeatsDisclaimer(
          'For this activity, minimum number of participants is ' +
            selectedActivitySchedule?.minNumberOfSeats +
            '. If you enter a number less than this, you will be charged for the minimum number of participants.'
        );
      }
    }
    if (remainingSeats && remainingSeats !== true) {
      if (Number(watch('numberOfParticipants')) > remainingSeats) {
        setError('numberOfParticipants', {
          type: 'manual',
          message: `Number of participants must be less than or equal to ${remainingSeats}`,
        });
      }
      if (Number(watch('numberOfSeats')) > remainingSeats) {
        setError('numberOfParticipants', {
          type: 'manual',
          message: `Number of ${transportationsLabel} must be less than or equal to ${remainingSeats}`,
        });
      }
      if (
        Number(watch('numberOfAdults') || 0) +
          Number(watch('numberOfChildren') || 0) >
        remainingSeats
      ) {
        setError('numberOfSeats', {
          type: 'manual',
          message: `Number of participants must be less than or equal to ${remainingSeats}`,
        });
      }
    }
  }, [
    selectedActivitySchedule,
    setValue,
    watch,
    numberOfChildren,
    numberOfAdults,
    numberOfParticipants,
    numberOfSeats,
    transportationsLabel,
    setError,
    clearErrors,
    remainingSeats,
    bookingPeopleList?.length,
  ]);

  useEffect(() => {
    if (
      Number(numberOfAdults ?? 0) + Number(numberOfChildren ?? 0) >
      bookingPeopleList?.length
    ) {
      setError('participantsExceeded', {
        type: 'manual',
        message: `Number of participants must be less than or equal to ${bookingPeopleList?.length}`,
      });
    }
  }, [numberOfAdults, numberOfChildren, bookingPeopleList, setError]);

  // HANDLE MINIMUM SEATS COST CALCULATION
  useEffect(() => {
    if (selectedActivitySchedule) {
      if (
        Number(watch('numberOfParticipants')) <
        Number(selectedActivitySchedule?.minNumberOfSeats)
      ) {
        setValue(
          'defaultRate',
          Number(selectedActivitySchedule?.minNumberOfSeats) *
            Number(
              selectedActivity?.activityRates?.find(
                (rate) => rate?.ageRange === 'adults'
              )?.amountUsd
            )
        );
      }
    } else {
      setValue('defaultRate', '');
    }
    if (
      Number(watch('numberOfAdults') || 0) +
        Number(watch('numberOfChildren') || 0) <
      (selectedActivitySchedule?.minNumberOfSeats ?? 0)
    ) {
      setValue(
        'defaultRate',
        Number(selectedActivitySchedule?.minNumberOfSeats) *
          Number(
            selectedActivity?.activityRates?.find(
              (rate) => rate?.ageRange === 'adults'
            )?.amountUsd
          )
      );
    } else {
      setValue('defaultRate', '');
    }
  }, [
    selectedActivitySchedule,
    selectedActivity,
    numberOfChildren,
    numberOfAdults,
    numberOfParticipants,
    setValue,
    watch,
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (
      selectedActivity?.name?.toUpperCase() ===
      'BOAT TRIP – PRIVATE, NON-SCHEDULED'
    ) {
      setValue('defaultRate', 200);
    }
  }, [selectedActivity?.name, setValue]);

  return (
    <Modal
      isOpen={selectBookingActivityModal}
      onClose={() => {
        dispatch(setSelectBookingActivityModal(false));
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
      heading={`Confirm adding ${selectedActivity?.name} to "${
        booking?.name
      } - ${formatDate(booking?.startDate)}"?`}
      className="min-w-[65vw]"
    >
      <form
        className="flex flex-col gap-3 w-full max-[600px]:min-w-[80vw]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-2 w-full max-[600px]:grid-cols-1">
          <Controller
            name="startDate"
            control={control}
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
          {selectedActivity?.name?.toUpperCase()?.includes('CAMPING') && (
            <Controller
              name="numberOfNights"
              control={control}
              rules={{
                required: 'Enter number of nights',
                validate: (value) => {
                  return (
                    Number(value) <=
                      moment(booking?.endDate).diff(
                        booking?.startDate,
                        'days'
                      ) || 'Number of nights cannot exceed booking nights'
                  );
                },
              }}
              defaultValue={moment(booking?.endDate).diff(
                booking?.startDate,
                'days'
              )}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      fromDate={booking?.startDate}
                      toDate={booking?.endDate}
                      label="Number of nights"
                      required
                      {...field}
                      defaultValue={booking?.endDate}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        trigger('numberOfNights');
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
          )}
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
                              label: activitySchedule?.description
                                ? `${''} ${label}`
                                : label,
                              value: `${activitySchedule.startTime}-${activitySchedule.endTime}`,
                            };
                          }
                        )}
                      />
                      {selectedActivitySchedule && remainingSeatsIsFetching ? (
                        <figure className="flex items-center gap-2">
                          <p className="text-[12px]">
                            Calculating available seats
                          </p>
                          <Loader className="text-primary" />
                        </figure>
                      ) : remainingSeats &&
                        (remainingSeats as boolean) !== true ? (
                        <p className="text-[13px] my-1 px-1 font-medium text-primary">
                          Number of {transportationsLabel} available for this
                          period: {remainingSeats}
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

          {selectedActivity?.activityRates?.find(
            (rate: ActivityRate) => rate?.ageRange === 'children'
          ) !== undefined ? (
            <>
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
                          clearErrors('participantsExceeded');
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
                          clearErrors('participantsExceeded');
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
                defaultValue={0}
                control={control}
                rules={{
                  required: `Specify the number of ${transportationsLabel} available for this activity`,
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
                        onChange={(e) => {
                          field.onChange(e);
                          clearErrors('numberOfParticipants');
                          clearErrors('participantsExceeded');
                        }}
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
        <menu className="flex flex-col gap-2 w-[100%]">
          {errors?.numberOfParticipants && (
            <InputErrorMessage
              message={errors?.numberOfParticipants?.message}
            />
          )}
          {errors?.numberOfSeats && (
            <InputErrorMessage message={errors?.numberOfSeats?.message} />
          )}
          <TemporaryBookingActivityPrice
            numberOfAdults={numberOfAdults}
            numberOfChildren={numberOfChildren}
            numberOfSeats={numberOfSeats}
            defaultRate={watch('defaultRate') * numberOfSeats}
            disclaimer={
              <menu>
                {selectedActivity?.disclaimer && (
                  <p className="text-sm">{selectedActivity?.disclaimer}</p>
                )}
                {minNumberOfSeatsDisclaimer && (
                  <p className="text-sm">{minNumberOfSeatsDisclaimer}</p>
                )}
              </menu>
            }
          />
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
          <Button
            disabled={Object.keys(errors)?.length > 0}
            className="btn btn-primary"
            submit
            primary
          >
            {createBookingActivityIsLoading ? <Loader /> : 'Confirm'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default SelectBookingActivity;
