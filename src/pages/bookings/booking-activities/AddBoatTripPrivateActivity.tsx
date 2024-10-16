import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { setAddBoatTripPrivateActivityModal } from '@/states/features/activitySlice';
import { createBookingActivityThunk } from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TemporaryBookingActivityPrice from './TemporaryBookingActivityPrice';
import {
  useGetStartTimeAndEndTime,
  useSelectActivitySchedule,
} from '@/hooks/bookings/activitySchedule.hooks';

const AddBoatTripPrivateActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addBoatTripPrivateActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );

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

  const { startDate, defaultRate, activitySchedule } = watch();

  // SELECT ACTIVITY SCHEDULE
  const selectActivitySchedule = useSelectActivitySchedule({
    control,
    errors,
    activitySchedules: selectedActivity?.activitySchedules,
    watch,
    setError,
    setValue,
    clearErrors,
  });

  // GET START TIME AND END TIME
  const { startTime, endTime } = useGetStartTimeAndEndTime({
    activityScheduleId: activitySchedule,
    date: startDate,
    activity: selectedActivity,
  });

  const {
    createBookingActivityIsLoading,
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
  } = useSelector((state: RootState) => state.bookingActivity);

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
        startTime,
        endTime,
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

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startDate', booking?.startDate);
  }, [booking?.startDate, setValue]);

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
          {selectActivitySchedule}
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
