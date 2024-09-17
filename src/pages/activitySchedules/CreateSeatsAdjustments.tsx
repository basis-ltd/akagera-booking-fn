import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { formatDate } from '@/helpers/strings.helper';
import { useCreateSeatsAdjustmentsMutation } from '@/states/apiSlice';
import {
  addToSeatsAdjustmentsList,
  setCreateSeatsAdjustmentsModal,
  setManageSeatsAdjustmentsModal,
} from '@/states/features/activityScheduleSlice';
import { AppDispatch, RootState } from '@/states/store';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateSeatsAdjustments = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createSeatsAdjustmentsModal, selectedActivitySchedule } = useSelector(
    (state: RootState) => state.activitySchedule
  );
  const { selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const [transportationsLabel, setTransportationsLabel] =
    useState<string>('seats');

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();

  const { startDate, endDate } = watch();

  // INITIALIZE CREATE SEATS ADJUSTMENTS MUTATION
  const [
    createSeatsAdjustments,
    {
      isLoading: createSeatsAdjustmentsIsLoading,
      isError: createSeatsAdjustmentsIsError,
      error: createSeatsAdjustmentsError,
      isSuccess: createSeatsAdjustmentsIsSuccess,
      data: createSeatsAdjustmentsData,
      reset: resetCreateSeatsAdjustments,
    },
  ] = useCreateSeatsAdjustmentsMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createSeatsAdjustments({
      activityScheduleId: selectedActivitySchedule?.id,
      startDate: formatDate(data?.startDate),
      endDate: formatDate(data?.endDate),
      adjustedSeats: data?.adjustedSeats,
      reason: data?.reason,
    });
  };

  // HANDLE CREATE SEATS ADJUSTMENTS RESPONSE
  useEffect(() => {
    if (createSeatsAdjustmentsIsError) {
      const errorResponse =
        (createSeatsAdjustmentsError as ErrorResponse)?.data?.message ||
        'An error occurred while creating seats adjustments. Refresh page and try again.';
      toast.error(errorResponse);
    } else if (createSeatsAdjustmentsIsSuccess) {
      dispatch(setCreateSeatsAdjustmentsModal(false));
      dispatch(setManageSeatsAdjustmentsModal(true));
      dispatch(addToSeatsAdjustmentsList(createSeatsAdjustmentsData?.data));
      resetCreateSeatsAdjustments();
    }
  }, [
    createSeatsAdjustmentsIsError,
    createSeatsAdjustmentsIsSuccess,
    createSeatsAdjustmentsError,
    dispatch,
    resetCreateSeatsAdjustments,
    createSeatsAdjustmentsData?.data,
  ]);

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

  return (
    <Modal
      isOpen={createSeatsAdjustmentsModal}
      onClose={() => {
        dispatch(setCreateSeatsAdjustmentsModal(false));
        dispatch(setManageSeatsAdjustmentsModal(true));
      }}
      heading={`Create Seats Adjustments for ${selectedActivitySchedule?.startTime} - ${selectedActivitySchedule?.endTime}`}
      className="min-w-[50vw]"
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full grid grid-cols-2 gap-5">
          <Controller
            control={control}
            name="startDate"
            rules={{
              required: 'Select start date',
              validate: (value) => {
                if (moment(value).isAfter(endDate)) {
                  return 'Start date must be before end date';
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    type="date"
                    {...field}
                    placeholder="Select start date"
                    label="Start date"
                    required
                  />
                  {errors?.startDate && (
                    <InputErrorMessage message={errors?.startDate?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            control={control}
            name="endDate"
            rules={{
              required: 'Select end date',
              validate: (value) => {
                if (moment(value).isBefore(startDate)) {
                  return 'End date must be after start date';
                }
              },
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    type="date"
                    {...field}
                    placeholder="Select end date"
                    label="End date"
                    required
                  />
                  {errors?.endDate && (
                    <InputErrorMessage message={errors?.endDate?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="adjustedSeats"
            control={control}
            rules={{ required: `Enter number of ${transportationsLabel}` }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    type="number"
                    {...field}
                    placeholder={`Enter number of ${transportationsLabel}`}
                    label={`Number of ${transportationsLabel}`}
                    required
                  />
                  {errors?.adjustedSeats && (
                    <InputErrorMessage
                      message={errors?.adjustedSeats?.message}
                    />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="reason"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    placeholder="Enter reason"
                    label="Reason (optional)"
                  />
                  {errors?.reason && (
                    <InputErrorMessage message={errors?.reason?.message} />
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
              dispatch(setCreateSeatsAdjustmentsModal(false));
              dispatch(setManageSeatsAdjustmentsModal(true));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {createSeatsAdjustmentsIsLoading ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateSeatsAdjustments;
