import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { formatDate, formatTime } from '@/helpers/strings.helper';
import { useLazyGetRemainingSeatsQuery } from '@/states/apiSlice';
import { Activity } from '@/types/models/activity.types';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { UUID } from 'crypto';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  SetFieldValue,
  UseFormClearErrors,
  UseFormReset,
  UseFormSetError,
  UseFormWatch,
} from 'react-hook-form';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

interface SelectActivityScheduleProps {
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  reset?: UseFormReset<FieldValues>;
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  activitySchedules: ActivitySchedule[];
  setValue: SetFieldValue<FieldValues>;
}

export const useSelectActivitySchedule = ({
  control,
  errors,
  activitySchedules,
  watch,
  setError,
  clearErrors,
}: SelectActivityScheduleProps) => {
  // CALCULATE REMAINING SEATS
  const { calculateRemainingSeats, remainingSeats, remainingSeatsIsFetching } =
    useFetchRemainingSeats();

  // REACT HOOK FORM
  const { startDate, numberOfAdults, numberOfChildren, numberOfParticipants, activitySchedule } =
    watch();

  useEffect(() => {
    if (activitySchedule) {
      calculateRemainingSeats(activitySchedule, formatDate(startDate));
    }
  }, [activitySchedule, startDate, calculateRemainingSeats]);

  useEffect(() => {
    if (typeof remainingSeats === 'number') {
      if (numberOfParticipants) {
        if (Number(numberOfParticipants) > Number(remainingSeats)) {
          setError('numberOfParticipants', {
            type: 'manual',
            message: 'Number of participants exceeds available seats',
          });
        } else {
          clearErrors('numberOfParticipants');
        }
      } else if (numberOfAdults || numberOfChildren) {
        if (
          (Number(numberOfAdults) || 0) + (Number(numberOfChildren) || 0) >
          Number(remainingSeats)
        ) {
          setError('numberOfParticipants', {
            type: 'manual',
            message: 'Number of participants exceeds available seats',
          });
        } else {
          clearErrors('numberOfParticipants');
        }
      }
    }
  }, [
    numberOfAdults,
    numberOfChildren,
    numberOfParticipants,
    remainingSeats,
    setError,
    clearErrors,
  ]);

  return (
    <>
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
                }}
                options={activitySchedules?.map(
                  (activitySchedule: ActivitySchedule) => {
                    const label = `${formatTime(
                      activitySchedule?.startTime
                    )} - ${formatTime(String(activitySchedule?.endTime))}`;
                    return {
                      label,
                      value: activitySchedule?.id,
                    };
                  }
                )}
              />
              {field?.value && remainingSeatsIsFetching ? (
                <figure className="flex items-center gap-2">
                  <p className="text-[12px]">Calculating available seats</p>
                  <Loader className="text-primary" />
                </figure>
              ) : remainingSeats && (remainingSeats as boolean) !== true ? (
                <p className="text-[13px] my-1 px-1 font-medium text-primary">
                  Number of seats available for this period: {remainingSeats}
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
    </>
  );
};

export const useFetchRemainingSeats = () => {
  // STATE VARIABLES
  const [remainingSeats, setRemainingSeats] = useState<number | boolean>(false);

  const [
    getRemainingSeats,
    {
      isFetching: remainingSeatsIsFetching,
      isSuccess: remainingSeatsIsSuccess,
      isError: remainingSeatsIsError,
      error: remainingSeatsError,
      data: remainingSeatsData,
    },
  ] = useLazyGetRemainingSeatsQuery();

  const calculateRemainingSeats = useCallback(
    async (id: string, date: Date | string) => {
      if (id && date) {
        const response = await getRemainingSeats({ id, date: formatDate(date) });
        setRemainingSeats(response?.data?.data);
      }
    },
    [getRemainingSeats]
  );

  // HANDLE FETCH REMAINING SEATS RESPONSE
  useEffect(() => {
    if (remainingSeatsIsSuccess) {
      setRemainingSeats(remainingSeatsData?.data);
    } else if (remainingSeatsIsError) {
      const errorMessage =
        (remainingSeatsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching the remaining seats';
      toast.error(errorMessage);
    }
  }, [
    remainingSeatsIsSuccess,
    remainingSeatsData,
    remainingSeatsIsError,
    remainingSeatsError,
  ]);

  return {
    getRemainingSeats,
    remainingSeatsIsFetching,
    remainingSeatsIsSuccess,
    remainingSeatsIsError,
    remainingSeatsError,
    calculateRemainingSeats,
    remainingSeats,
  };
};

interface GetStartTimeAndEndTimeProps {
  activityScheduleId: UUID;
  date: Date;
  activity: Activity;
}

export const useGetStartTimeAndEndTime = ({
  activityScheduleId,
  date,
  activity,
}: GetStartTimeAndEndTimeProps) => {
  const activitySchedule = activity?.activitySchedules?.find(
    (activitySchedule: ActivitySchedule) =>
      activitySchedule?.id === activityScheduleId
  );

  const startTime = moment(
    `${formatDate(date)}T${activitySchedule?.startTime}`
  ).format();
  const endTime = moment(
    `${formatDate(date)}T${activitySchedule?.endTime}`
  ).format();

  return {
    startTime,
    endTime,
  };
};
