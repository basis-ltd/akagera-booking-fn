import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import { formatDate, formatTime } from '@/helpers/strings.helper';
import { calculateRemainingSeatsThunk } from '@/states/features/activityScheduleSlice';
import { setAddGameDayDriveActivityModal } from '@/states/features/activitySlice';
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

const AddGameDayDriveActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addGameDayDriveActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const {
    createBookingActivityIsLoading,
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
  } = useSelector((state: RootState) => state.bookingActivity);
  const { booking } = useSelector((state: RootState) => state.booking);
  const [selectedActivitySchedule, setSelectedActivitySchedule] = useState<
    ActivitySchedule | undefined
  >(undefined);
  const { remainingSeats, remainingSeatsIsFetching } = useSelector(
    (state: RootState) => state.activitySchedule
  );
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
    reset,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
    setError,
  } = useForm();

  const { startDate, defaultRate, numberOfSeats } = watch();

  // HANDLE SUBMIT
  const onSubmit = async (data: FieldValues) => {
    dispatch(
      createBookingActivityThunk({
        numberOfSeats: Number(data?.numberOfSeats),
        activityId: selectedActivity?.id,
        defaultRate: data?.defaultRate,
        startTime: bookingActivity?.startTime,
        endTime: bookingActivity?.endTime,
        bookingId: booking?.id,
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
      dispatch(setAddGameDayDriveActivityModal(false));
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

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startDate', booking?.startDate);
  }, [booking, selectedActivity, setValue]);

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

  return (
    <Modal
      isOpen={addGameDayDriveActivityModal}
      onClose={() => {
        dispatch(setAddGameDayDriveActivityModal(false));
      }}
      heading={`Add Game Day Drive Activity (AMC Operated)`}
      className="min-w-[60vw]"
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
                          const [startTime, endTime] = e.split('-');
                          if (
                            Number(endTime?.split(':')[0]) -
                              Number(startTime?.split(':')[0]) >
                            5
                          ) {
                            setValue(
                              'defaultRate',
                              350 * Number(watch('numberOfSeats'))
                            );
                          } else if (
                            Number(endTime?.split(':')[0]) -
                              Number(startTime?.split(':')[0]) <=
                            5
                          ) {
                            setValue(
                              'defaultRate',
                              250 * Number(watch('numberOfSeats'))
                            );
                          }
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
                            Calculating available cars
                          </p>
                          <Loader className="text-primary" />
                        </figure>
                      ) : remainingSeats &&
                        (remainingSeats as boolean) !== true ? (
                        <p className="text-[13px] my-1 px-1 font-medium text-primary">
                          Number of cars available for this period:{' '}
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
            name="numberOfSeats"
            defaultValue={1}
            control={control}
            rules={{
              required: `Specify the number of cars available for this activity`,
            }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-2">
                  <Input
                    {...field}
                    type="number"
                    label={`Number of cars`}
                    required
                    onChange={(e) => {
                      field.onChange(e);
                      clearErrors('numberOfParticipants');
                      if (Number(e.target.value) > Number(remainingSeats)) {
                        setError('numberOfParticipants', {
                          type: 'manual',
                          message: `Number of selected cars should not exceed available cars`,
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
        <menu className="w-full flex flex-col gap-3">
          {Object.keys(errors)?.length > 0 && (
            <menu className="w-full flex flex-col gap-2">
              {errors?.numberOfParticipants && (
                <InputErrorMessage
                  message={errors?.numberOfParticipants?.message}
                />
              )}
            </menu>
          )}
          {defaultRate > 0 && (
            <TemporaryBookingActivityPrice
              defaultRate={defaultRate * numberOfSeats}
            />
          )}
          <p className="font-medium text-[14px]">
            One car cannot exceed 7 passengers in total.
          </p>
        </menu>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              reset({
                startDate: booking?.startDate,
                activitySchedule: '',
              });
              dispatch(setAddGameDayDriveActivityModal(false));
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

export default AddGameDayDriveActivity;
