import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { setAddBoatTripMorningDayActivityModal } from '@/states/features/activitySlice';
import { createBookingActivityThunk } from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import TemporaryBookingActivityPrice from './TemporaryBookingActivityPrice';
import { useGetStartTimeAndEndTime } from '@/hooks/bookings/activitySchedule.hooks';
import { useSelectBookingActivityForm } from '@/hooks/bookings/bookingActivity.hooks';

const AddBoatTripMorningDayActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { addBoatTripMorningDayActivityModal, selectedActivity } = useSelector(
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

  const { startDate, numberOfAdults, numberOfChildren, activitySchedule } =
    watch();

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

  const { createBookingActivityIsLoading, createBookingActivityIsSuccess } =
    useSelector((state: RootState) => state.bookingActivity);

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
        startTime,
        endTime,
      })
    );
  };

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

  return (
    <Modal
      isOpen={addBoatTripMorningDayActivityModal}
      onClose={() => {
        dispatch(setAddBoatTripMorningDayActivityModal(false));
      }}
      heading={`Add Boat Trip Morning Day Activity`}
      className="min-w-[60%]"
    >
      <form
        className="w-full flex flex-col gap-4 max-[600px]:min-w-[80vw]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-5 w-full max-[600px]:grid-cols-1">
          {selectBookingActivityForm}
        </fieldset>
        {Object.keys(errors)?.length > 0 && (
          <menu className="w-full flex flex-col gap-2">
            {errors?.numberOfParticipants && (
              <InputErrorMessage
                message={errors?.numberOfParticipants?.message}
              />
            )}
            {errors?.remainingSeats && (
              <InputErrorMessage message={errors?.remainingSeats?.message} />
            )}
          </menu>
        )}
        <TemporaryBookingActivityPrice
          numberOfAdults={numberOfAdults}
          numberOfChildren={numberOfChildren}
        />
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
          <Button primary submit disabled={Object.keys(errors)?.length > 0}>
            {createBookingActivityIsLoading ? <Loader /> : 'Add activity'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default AddBoatTripMorningDayActivity;
