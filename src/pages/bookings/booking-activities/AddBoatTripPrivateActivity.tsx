import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import { formatDate, formatTime } from '@/helpers/strings.helper';
import { calculateRemainingSeatsThunk } from '@/states/features/activityScheduleSlice';
import { setAddBoatTripPrivateActivityModal } from '@/states/features/activitySlice';
import { createBookingActivityThunk } from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { UUID } from 'crypto';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TemporaryBookingActivityPrice from './TemporaryBookingActivityPrice';

const AddBoatTripPrivateActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addBoatTripPrivateActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const [selectedActivitySchedule, setSelectedActivitySchedule] = useState<
    ActivitySchedule | undefined
  >(undefined);
  const {
    createBookingActivityIsLoading,
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
  } = useSelector((state: RootState) => state.bookingActivity);
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
  const { remainingSeats, remainingSeatsIsFetching } = useSelector(
    (state: RootState) => state.activitySchedule
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );

  // REACT HOOK FORM
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
    trigger,
  } = useForm();
  const { startDate, defaultRate } = watch();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    dispatch(
      createBookingActivityThunk({
        numberOfSeats: data?.numberOfSeats || 1,
        numberOfAdults: data?.numberOfAdults || 1,
        numberOfChildren: data?.numberOfChildren || 0,
        bookingId: booking?.id,
        activityId: selectedActivity?.id,
        defaultRate: data?.defaultRate,
        startTime: bookingActivity?.startTime,
        endTime: bookingActivity?.endTime,
      })
    );
  };

  // HANDLE CREATE BOOKING ACTIVITY RESPONSE
  useEffect(() => {
    if (createBookingActivityIsError) {
      if (createBookingActivityIsError) {
        toast.error(
          'An error occured while creating booking activity. Please try again later.'
        );
      }
    } else if (createBookingActivityIsSuccess) {
      dispatch(setAddBoatTripPrivateActivityModal(false));
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
  ]);

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

  return (
    <Modal
      isOpen={addBoatTripPrivateActivityModal}
      onClose={() => {
        dispatch(setAddBoatTripPrivateActivityModal(false));
      }}
      heading={`Add Boat Trip Private Activity`}
      className="min-w-[50%]"
    >
      <form
        className="w-full flex flex-col gap-4 max-[600px]:min-w-[80vw]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-5 w-full max-[600px]:grid-cols-1">
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
                      {field?.value && remainingSeatsIsFetching ? (
                        <figure className="flex items-center gap-2">
                          <p className="text-[12px]">
                            Calculating available boats
                          </p>
                          <Loader className="text-primary" />
                        </figure>
                      ) : remainingSeats &&
                        (remainingSeats as boolean) !== true ? (
                        <p className="text-[13px] my-1 px-1 font-medium text-primary">
                          Number of boats available for this period:{' '}
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
            name="numberOfParticipants"
            control={control}
            rules={{
              required: 'Number of participants is required',
              validate: (value) => {
                if (Number(value) > 29) {
                  return 'Number of participants should not exceed 29';
                }
                if (Number(value) > bookingPeopleList?.length) {
                  return 'Number of participants exceed the number of people in the booking';
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
                    placeholder="Number of participants"
                    required
                    onChange={async (e) => {
                      field.onChange(e.target.value);
                      clearErrors('numberOfSeats');
                      if (Number(e.target.value) <= 11) {
                        setValue('defaultRate', 200);
                        setValue('numberOfSeats', 1);
                      } else if (Number(e.target.value) <= 18) {
                        setValue('defaultRate', 360);
                        setValue('numberOfSeats', 1);
                      } else if (Number(e.target.value) <= 29) {
                        setValue('defaultRate', 560);
                        setValue('numberOfSeats', 2);
                      } else if (Number(e.target.value) > 29) {
                        setValue('numberOfSeats', 2);
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
          <Controller
            name="numberOfSeats"
            control={control}
            rules={{ required: 'Number of boats is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    type="number"
                    {...field}
                    label="Number of boats"
                    placeholder="Number of seats"
                    required
                    readOnly
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
        {defaultRate > 0 && Object.keys(errors)?.length <= 0 && (
          <TemporaryBookingActivityPrice defaultRate={defaultRate} />
        )}
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              reset({
                startDate: booking?.startDate,
                activitySchedule: '',
              });
              dispatch(setAddBoatTripPrivateActivityModal(false));
            }}
          >
            Cancel
          </Button>
          <Button primary submit disabled={Object.keys(errors)?.length > 0}>
            {createBookingActivityIsLoading ? <Loader /> : 'Add activity'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default AddBoatTripPrivateActivity;
