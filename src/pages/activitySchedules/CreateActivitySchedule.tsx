import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import Modal from '@/components/modals/Modal';
import { dayHoursArray } from '@/helpers/activity.helper';
import { formatTime } from '@/helpers/strings.helper';
import { useCreateActivityScheduleMutation } from '@/states/apiSlice';
import { setSelectedActivity } from '@/states/features/activitySlice';
import { addToActivityScheduleList, setCreateActivityScheduleModal } from '@/states/features/activityScheduleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateActivitySchedule = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { createActivityScheduleModal } = useSelector(
    (state: RootState) => state.activitySchedule
  );
  const [transportationsLabel, setTransportationsLabel] =
    useState<string>('transportations');

  // REACT HOOK FORM
  const { control, handleSubmit, formState, trigger, watch } = useForm();

  // INITIALIZE CRESTE ACTIVITY SCHEDULE MUTATION
  const [
    createActivitySchedule,
    {
      data: createActivityScheduleData,
      error: createActivityScheduleError,
      isError: createActivityScheduleIsError,
      isLoading: createActivityScheduleIsLoading,
      isSuccess: createActivityScheduleIsSuccess,
    },
  ] = useCreateActivityScheduleMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createActivitySchedule({
      startTime: data?.startTime,
      endTime: data?.endTime,
      description: data?.description,
      disclaimer: data?.disclaimer,
      numberOfSeats: data?.numberOfSeats,
      activityId: selectedActivity?.id,
    });
  };

  // HANDLE ACTIVITY SCHEDULE CREATION RESPONSE
  useEffect(() => {
    if (createActivityScheduleIsSuccess) {
      dispatch(setCreateActivityScheduleModal(false));
      dispatch(setSelectedActivity(null));
      toast.success('Activity schedule created successfully');
      dispatch(addToActivityScheduleList(createActivityScheduleData?.data));
    }
    if (createActivityScheduleIsError) {
      toast.error(
        (createActivityScheduleError as ErrorResponse)?.data?.message ||
          'An error occurred while creating activity schedule. Refresh page and try again.'
      );
    }
  }, [
    createActivityScheduleIsSuccess,
    createActivityScheduleIsError,
    dispatch,
    createActivityScheduleError,
    createActivityScheduleData?.data,
  ]);

  // SET TRANSPORTATIONS LABEL
  useEffect(() => {
    switch (selectedActivity?.name?.toUpperCase()) {
      case 'BOAT TRIP – PRIVATE, NON-SCHEDULED':
        setTransportationsLabel('participants');
        break;
      case 'GUIDE FOR SELF-DRIVE GAME DRIVE':
        setTransportationsLabel('guides');
        break;
      case 'BOAT TRIP – SCHEDULED MORNING/DAY':
      case 'BOAT TRIP – SCHEDULED SUNSET':
        setTransportationsLabel('boats');
        break;
      default:
        setTransportationsLabel('transportations');
        break;
    }
  }, [selectedActivity?.name]);

  return (
    <Modal
      isOpen={createActivityScheduleModal}
      onClose={() => {
        dispatch(setCreateActivityScheduleModal(false));
      }}
      heading={`Add activity schedule for ${selectedActivity?.name}`}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-5 w-full">
          <Controller
            name="startTime"
            control={control}
            rules={{
              required: 'Select start time for this schedule',
              validate: (value) => {
                if (value && formatTime(value) >= formatTime(watch('endTime')))
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
            rules={{
              required: 'Select end time for this schedule',
              validate: (value) => {
                if (
                  value &&
                  formatTime(value) <= formatTime(watch('startTime'))
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
            name="numberOfSeats"
            control={control}
            rules={{
              required: `Enter number of available ${transportationsLabel}`,
            }}
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
              dispatch(setCreateActivityScheduleModal(false));
              dispatch(setSelectedActivity(null));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {createActivityScheduleIsLoading ? <Loader /> : 'Create'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateActivitySchedule;
