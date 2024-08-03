import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import TextArea from '@/components/inputs/TextArea';
import Modal from '@/components/modals/Modal';
import {
  useCreateActivityMutation,
  useLazyFetchServicesQuery,
} from '@/states/apiSlice';
import {
  addActivityToList,
  setCreateActivityModal,
} from '@/states/features/activitySlice';
import { setServicesList } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createActivityModal } = useSelector(
    (state: RootState) => state.activity
  );
  const { servicesList } = useSelector((state: RootState) => state.service);

  // INITIALIZE FETCH SERVICES QUERY
  const [
    fetchServices,
    {
      data: servicesData,
      error: servicesError,
      isError: servicesIsError,
      isFetching: servicesIsFetching,
      isSuccess: servicesIsSuccess,
    },
  ] = useLazyFetchServicesQuery();

  // FETCH SERVICES
  useEffect(() => {
    fetchServices({ size: 100, page: 0 });
  }, [fetchServices]);

  // HANDLE FETCH SERVICES RESPONSE
  useEffect(() => {
    if (servicesIsError) {
      const errorResponse =
        (servicesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching services. Refresh page and try again.';
      toast.error(errorResponse);
    } else if (servicesIsSuccess) {
      dispatch(setServicesList(servicesData?.data?.rows));
    }
  }, [
    servicesIsError,
    servicesError,
    servicesIsSuccess,
    dispatch,
    servicesData?.data?.rows,
  ]);

  // INITIALIZE CREATE ACTIVITY MUTATION
  const [
    createActivity,
    {
      data: createActivityData,
      error: createActivityError,
      isError: createActivityIsError,
      isLoading: createActivityIsLoading,
      isSuccess: createActivityIsSuccess,
      reset: createActivityReset,
    },
  ] = useCreateActivityMutation();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createActivity({
      serviceId: data?.serviceId,
      name: data?.name,
      description: data?.description,
      disclaimer: data?.disclaimer,
    });
  };

  // HANDLE CREATE ACTIVITY RESPONSE
  useEffect(() => {
    if (createActivityIsError) {
      const errorResponse =
        (createActivityError as ErrorResponse)?.data?.message ||
        'An error occurred while creating activity. Please try again.';
      toast.error(errorResponse);
    } else if (createActivityIsSuccess) {
      toast.success('Activity created successfully');
      dispatch(addActivityToList(createActivityData?.data));
      reset({
        serviceId: '',
        name: '',
        description: '',
        disclaimer: '',
      });
      createActivityReset();
      dispatch(setCreateActivityModal(false));
    }
  }, [
    createActivityData,
    createActivityError,
    createActivityIsError,
    createActivityIsSuccess,
    createActivityReset,
    dispatch,
    reset,
  ]);

  return (
    <Modal
      isOpen={createActivityModal}
      onClose={() => {
        dispatch(setCreateActivityModal(false));
      }}
      heading="Add new activity"
      className="!min-w-[50vw]"
    >
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full grid grid-cols-2 gap-5">
          <Controller
            name="serviceId"
            rules={{ required: 'Select service' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    label="Service"
                    required
                    options={servicesList?.map((service) => {
                      return {
                        label: servicesIsFetching ? '...' : service?.name,
                        value: service?.id,
                      };
                    })}
                    {...field}
                  />
                  {errors?.serviceId && (
                    <InputErrorMessage message={errors?.serviceId?.message} />
                  )}
                </label>
              );
            }}
          />
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
                    placeholder="Add activity name"
                  />
                  {errors?.name && (
                    <InputErrorMessage message={errors?.name?.message} />
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
                    placeholder="Enter activity description"
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
                    placeholder="Enter activity disclaimer"
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
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {createActivityIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateActivity;
