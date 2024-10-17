import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  SetFieldValue,
  UseFormClearErrors,
  UseFormReset,
  UseFormSetError,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import { validatePersonAgeRange } from '@/helpers/validations.helper';
import Input from '@/components/inputs/Input';
import { Booking } from '@/types/models/booking.types';
import { useSelectActivitySchedule } from './activitySchedule.hooks';
import { Activity } from '@/types/models/activity.types';

interface SelectBookingActivityFormProps {
  booking: Booking;
  control: Control<FieldValues>;
  setValue: SetFieldValue<FieldValues>;
  errors: FieldErrors<FieldValues>;
  trigger: UseFormTrigger<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  reset?: UseFormReset<FieldValues>;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  activity: Activity;
}

export const useSelectBookingActivityForm = ({
  booking,
  errors,
  control,
  trigger,
  clearErrors,
  activity,
  setError,
  setValue,
  watch,
}: SelectBookingActivityFormProps) => {
  // SELECT ACTIVITY SCHEDULE
  const selectActivitySchedule = useSelectActivitySchedule({
    control,
    errors,
    activitySchedules: activity?.activitySchedules,
    activity,
    watch,
    setError,
    setValue,
    clearErrors,
  });

  return (
    <>
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
                <InputErrorMessage message={errors?.numberOfAdults?.message} />
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
    </>
  );
};
