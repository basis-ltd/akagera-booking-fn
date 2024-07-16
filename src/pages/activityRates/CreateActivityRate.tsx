import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import Modal from '@/components/modals/Modal';
import { ageRageOptions } from '@/constants/activityRate.constants';
import { useCreateActivityRateMutation } from '@/states/apiSlice';
import {
  addToActivityRatesList,
  setCreateActivityRateModal,
} from '@/states/features/activityRateSlice';
import { setSelectedActivity } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateActivityRate = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createActivityRateModal } = useSelector(
    (state: RootState) => state.activityRate
  );
  const { selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // INITIALIZE CREATE ACTIVITY RATE MUTATION
  const [
    createActivityRate,
    {
      data: createActivityRateData,
      error: createActivityRateError,
      isError: createActivityRateIsError,
      isLoading: createActivityRateIsLoading,
      isSuccess: createActivityRateIsSuccess,
      reset: resetCreateActivityRate,
    },
  ] = useCreateActivityRateMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createActivityRate({
      name: data?.name,
      ageRange: data?.ageRange === 'n/a' ? 'adults' : data?.ageRange,
      amountUsd: data?.amountUsd && Number(data?.amountUsd),
      amountRwf: data?.amountRwf && Number(data?.amountRwf),
      description: data?.description,
      disclaimer: data?.disclaimer,
      activityId: selectedActivity?.id,
    });
  };

  // HANDLE ACTIVITY RATE CREATION RESPONSE
  useEffect(() => {
    if (createActivityRateIsSuccess) {
      dispatch(addToActivityRatesList(createActivityRateData?.data));
      resetCreateActivityRate();
      dispatch(setCreateActivityRateModal(false));
      toast.success('Activity rate created successfully');
      reset({
        name: '',
        ageRange: '',
        amountUsd: '',
        amountRwf: '',
        description: '',
      });
    } else if (createActivityRateIsError) {
      const errorResponse = (createActivityRateError as ErrorResponse)?.data
        ?.message;
      toast.error(
        errorResponse || 'Failed to create activity rate. Please try again.'
      );
    }
  }, [
    createActivityRateIsSuccess,
    createActivityRateIsError,
    createActivityRateError,
    dispatch,
    reset,
    createActivityRateData?.data,
    resetCreateActivityRate,
  ]);

  return (
    <Modal
      isOpen={createActivityRateModal}
      onClose={() => {
        dispatch(setCreateActivityRateModal(false));
        reset({
          name: '',
          ageRange: '',
          amountUsd: '',
          amountRwf: '',
          description: '',
        });
        dispatch(setSelectedActivity(null));
      }}
      heading={`Create activity rate for ${selectedActivity?.name}`}
    >
      <form
        className="w-full flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 items-center gap-5">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Name"
                    required
                    placeholder="Enter the name for this rate"
                  />
                  {errors.name && (
                    <InputErrorMessage message={errors.name.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="ageRange"
            control={control}
            rules={{ required: 'Age range is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    options={ageRageOptions}
                    {...field}
                    label="Age Range"
                    placeholder="Select the age range"
                    required
                  />
                  {errors.ageRange && (
                    <InputErrorMessage message={errors.ageRange.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="amountUsd"
            rules={{ required: 'Amount in USD is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Amount in USD"
                    required
                    type="number"
                    placeholder="Enter the amount in USD"
                  />
                  {errors.amountUsd && (
                    <InputErrorMessage message={errors.amountUsd.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="amountrwf"
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Amount in RWF"
                    required
                    type="number"
                    placeholder="Enter the amount in RWF"
                  />
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
        </fieldset>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateActivityRateModal(false));
              reset({
                name: '',
                ageRange: '',
                amountUsd: '',
                amountRwf: '',
                description: '',
              });
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {createActivityRateIsLoading ? <Loader /> : 'Create'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateActivityRate;
