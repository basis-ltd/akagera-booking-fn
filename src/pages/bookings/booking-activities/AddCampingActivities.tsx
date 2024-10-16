import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { setAddCampingActivitiesModal } from '@/states/features/activitySlice';
import { createBookingActivityThunk } from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TemporaryBookingActivityPrice from './TemporaryBookingActivityPrice';
import { useSelectBookingActivityForm } from '@/hooks/bookings/bookingActivity.hooks';
import {
  useFetchRemainingSeats,
  useGetStartTimeAndEndTime,
} from '@/hooks/bookings/activitySchedule.hooks';

const AddCampingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addCampingActivitiesModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);

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
    watch,
  } = useForm();

  const {
    startDate,
    numberOfAdults,
    numberOfChildren,
    activitySchedule,
    numberOfNights,
  } = watch();

  // SELECT BOOKING ACTIVITY FORM
  const selectBookingActivityForm = useSelectBookingActivityForm({
    booking,
    control,
    errors,
    trigger,
    clearErrors,
    activity: selectedActivity,
    setValue,
    watch,
    setError,
  });

  // GET START TIME AND END TIME
  const { startTime, endTime } = useGetStartTimeAndEndTime({
    activityScheduleId: activitySchedule,
    date: startDate,
    activity: selectedActivity,
  });

  const { remainingSeats, calculateRemainingSeats } = useFetchRemainingSeats();

  const [campingEndTime, setCampingEndTime] = useState<string | undefined>(
    endTime
  );

  const {
    createBookingActivityIsLoading,
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
  } = useSelector((state: RootState) => state.bookingActivity);

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startDate', booking?.startDate);
  }, [booking, selectedActivity, setValue]);

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
        startTime,
        endTime: campingEndTime,
      })
    );
  };

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startDate', booking?.startDate);
  }, [booking, selectedActivity, setValue]);

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

  return (
    <Modal
      isOpen={addCampingActivitiesModal}
      onClose={() => {
        dispatch(setAddCampingActivitiesModal(false));
      }}
      heading={`Add ${selectedActivity?.name}`}
      className="min-w-[60vw] max-[600px]:min-w-[80vw]"
    >
      <form
        className="w-full flex flex-col gap-4 max-[600px]:min-w-[80vw]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {selectBookingActivityForm}
          <Controller
            name="numberOfNights"
            control={control}
            defaultValue={
              moment(booking?.endDate).diff(booking?.startDate, 'days') || 1
            }
            rules={{
              required: 'Enter number of nights',
              validate: (value) => {
                if (Number(value) === 0) {
                  return 'Number of nights cannot be zero';
                }
                return (
                  Number(value) <=
                    moment(booking?.endDate).diff(booking?.startDate, 'days') ||
                  'Number of nights cannot exceed booking nights'
                );
              },
            }}
            render={({ field }) => (
              <label className="w-full flex flex-col gap-1">
                <Input
                  {...field}
                  type="number"
                  label="Number of nights"
                  required
                  onChange={async (e) => {
                    field.onChange(e.target.value);
                    setCampingEndTime(
                      moment(startTime)
                        .add(Number(e?.target?.value), 'days')
                        .format()
                    );
                    await trigger('numberOfNights');
                  }}
                />
                {errors?.numberOfNights && (
                  <InputErrorMessage
                    message={errors?.numberOfNights?.message}
                  />
                )}
              </label>
            )}
          />
          <Controller
            name="numberOfSeats"
            control={control}
            rules={{ required: 'Number of tents is required' }}
            render={({ field }) => (
              <label className="w-full flex flex-col gap-1">
                <Input
                  {...field}
                  type="number"
                  label="Number of tents"
                  required
                  onChange={async (e) => {
                    field.onChange(e.target.value);
                    calculateRemainingSeats(activitySchedule, startDate);
                    clearErrors('numberOfParticipants');
                    if (
                      remainingSeats &&
                      typeof remainingSeats === 'number' &&
                      Number(e?.target?.value) > Number(remainingSeats)
                    ) {
                      setError('numberOfParticipants', {
                        type: 'manual',
                        message:
                          'Number of tents exceeds available tents for this period',
                      });
                    }
                  }}
                />
                {errors?.numberOfSeats && (
                  <InputErrorMessage message={errors?.numberOfSeats?.message} />
                )}
              </label>
            )}
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
        <TemporaryBookingActivityPrice
          numberOfAdults={numberOfAdults}
          numberOfChildren={numberOfChildren}
          numberOfSeats={numberOfNights}
        />
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
    </Modal>
  );
};

export default AddCampingActivities;
