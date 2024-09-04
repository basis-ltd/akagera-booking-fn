import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import Modal from '@/components/modals/Modal';
import { dayHoursArray } from '@/helpers/activity.helper';
import { useUpdateActivityScheduleMutation } from '@/states/apiSlice';
import { setSelectedActivity } from '@/states/features/activitySlice';
import {
  setActivityScheduleDetailsModal,
  setSelectedActivitySchedule,
} from '@/states/features/activityScheduleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const ActivityScheduleDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { activityScheduleDetailsModal, selectedActivitySchedule } =
    useSelector((state: RootState) => state.activitySchedule);
  const [transportationsLabel, setTransportationsLabel] =
    useState<string>('seats');

  // REACT HOOK FORM
  const { control, handleSubmit, formState, setValue, watch, trigger } =
    useForm();

  // INITIALIZE UPDATE ACTIVITY SCHEDULE MUTATION
  const [
    updateActivitySchedule,
    {
      error: updateActivityScheduleError,
      isError: updateActivityScheduleIsError,
      isLoading: updateActivityScheduleIsLoading,
      isSuccess: updateActivityScheduleIsSuccess,
    },
  ] = useUpdateActivityScheduleMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateActivitySchedule({
      id: selectedActivitySchedule?.id,
      startTime: data?.startTime,
      endTime: data?.endTime,
      description: data?.description,
      disclaimer: data?.disclaimer,
      numberOfSeats: data?.numberOfSeats,
      minNumberOfSeats: data?.minNumberOfSeats || undefined,
      maxNumberOfSeats: data?.maxNumberOfSeats || undefined,
      activityId: selectedActivity?.id,
    });
  };

  // HANDLE UPDATE ACTIVITY SCHEDULE RESPONSE
  useEffect(() => {
    if (updateActivityScheduleIsSuccess) {
      toast.success('Activity schedule updated successfully');
      dispatch(setActivityScheduleDetailsModal(false));
    } else if (updateActivityScheduleIsError) {
      const errorResponse = (updateActivityScheduleError as ErrorResponse)?.data
        ?.message;
      toast.error(
        errorResponse || 'An error occurred while updating activity schedule'
      );
    }
  }, [
    updateActivityScheduleIsSuccess,
    dispatch,
    updateActivityScheduleIsError,
    updateActivityScheduleError,
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('startTime', selectedActivitySchedule?.startTime);
    setValue('endTime', selectedActivitySchedule?.endTime);
    setValue('description', selectedActivitySchedule?.description);
    setValue('disclaimer', selectedActivitySchedule?.disclaimer);
    setValue('minNumberOfSeats', selectedActivitySchedule?.minNumberOfSeats);
    setValue('maxNumberOfSeats', selectedActivitySchedule?.maxNumberOfSeats);
    setValue('numberOfSeats', selectedActivitySchedule?.numberOfSeats);
  }, [selectedActivitySchedule, setValue]);

  // SET TRANSPORTATIONS LABEL
  useEffect(() => {
    switch (selectedActivity?.slug) {
      case 'behind-the-scenes-tour':
        setTransportationsLabel('participants');
        break;
      case 'boat-trip-morning-day':
      case 'boat-trip-morning-day-amc-operated':
      case 'boat-trip-sunset-trip':
        setTransportationsLabel('seats');
        break;
      case 'camping':
      case 'camping-at-mihindi-campsite':
      case 'camping-at-mihindi-for-rwanda-nationals':
      case 'camping-for-rwandan-nationals':
        setTransportationsLabel('tents');
        break;
      case 'game-drive-day-amc-operated':
      case 'night-drive-operated-by-amc':
        setTransportationsLabel('cars');
        break;
      case 'boat-trip–private-non-scheduled':
        setTransportationsLabel('participants');
        break;
      default:
        setTransportationsLabel('transportations');
        break;
    }
  }, [selectedActivity, selectedActivitySchedule]);

  const cleanTime = (time: string) => {
    return time?.split(':')[0];
  };

  return (
    <Modal
      isOpen={activityScheduleDetailsModal}
      onClose={() => {
        dispatch(setActivityScheduleDetailsModal(false));
        dispatch(setSelectedActivitySchedule(null));
        dispatch(setSelectedActivity(null));
      }}
      heading={`Manage ${selectedActivitySchedule?.description || ''} Schedule`}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-5 w-full">
          <Controller
            name="startTime"
            control={control}
            defaultValue={selectedActivitySchedule?.startTime || ''}
            rules={{
              required: 'Select start time for this schedule',
              validate: (value) => {
                if (
                  value &&
                  Number(cleanTime(value)) >=
                    Number(cleanTime(watch('endTime')))
                )
                  return 'Start Time must be less than End Time';
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex w-full flex-col gap-1">
                  <Select
                    options={dayHoursArray}
                    label="Start time"
                    required
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      await trigger('endTime');
                      await trigger('startTime');
                    }}
                  />
                  {formState.errors.startTime && (
                    <InputErrorMessage
                      message={formState.errors.startTime.message}
                    />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="endTime"
            control={control}
            defaultValue={selectedActivitySchedule?.endTime || ''}
            rules={{
              required: 'Select end time for this schedule',
              validate: (value) => {
                if (
                  value &&
                  Number(cleanTime(value)) <= Number(cleanTime(watch('startTime')))
                )
                  return 'End Time must be greater than Start Time';
              },
            }}
            render={({ field }) => {
              return (
                <label className="flex w-full flex-col gap-1">
                  <Select
                    options={dayHoursArray}
                    label="End time"
                    required
                    {...field}
                    onChange={async (e) => {
                      field.onChange(e);
                      await trigger('endTime');
                      await trigger('startTime');
                    }}
                  />
                  {formState.errors.endTime && (
                    <InputErrorMessage
                      message={formState.errors.endTime.message}
                    />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="description"
            control={control}
            defaultValue={selectedActivitySchedule?.description || ''}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    {...field}
                    label="Description (optional)"
                    placeholder="Enter description"
                  />
                </label>
              );
            }}
          />
          <Controller
            name="disclaimer"
            control={control}
            defaultValue={selectedActivitySchedule?.disclaimer || ''}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <TextArea
                    {...field}
                    label="Disclaimer (optional)"
                    placeholder="Enter disclaimer"
                  />
                </label>
              );
            }}
          />
          <Controller
            name="minNumberOfSeats"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    type="number"
                    label={`Minimum number of ${transportationsLabel} (optional)`}
                    placeholder={`Enter minimum number of ${transportationsLabel}`}
                  />
                </label>
              );
            }}
          />
          
          <Controller
            name="maxNumberOfSeats"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    type="number"
                    label={`Maximum number of ${transportationsLabel} (optional)`}
                    placeholder={`Enter maximum number of ${transportationsLabel}`}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="numberOfSeats"
            control={control}
            rules={{
              required: `Enter number of available ${transportationsLabel}`,
            }}
            defaultValue={selectedActivitySchedule?.numberOfSeats || ''}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    required
                    type="number"
                    label={`Number of available ${transportationsLabel}`}
                    placeholder={`Enter number of available ${transportationsLabel}`}
                  />
                  {formState.errors.numberOfSeats && (
                    <InputErrorMessage
                      message={formState.errors.numberOfSeats.message}
                    />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setActivityScheduleDetailsModal(false));
              dispatch(setSelectedActivitySchedule(null));
              dispatch(setSelectedActivity(null));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {updateActivityScheduleIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default ActivityScheduleDetails;
