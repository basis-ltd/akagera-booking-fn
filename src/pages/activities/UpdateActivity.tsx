import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import TextArea from '@/components/inputs/TextArea';
import Modal from '@/components/modals/Modal';
import { useUpdateActivityMutation } from '@/states/apiSlice';
import { setUpdateActivityModal } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );

  // REACT HOOK FORM
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  // UPDATE DEFAULT VALUES
  useEffect(() => {
    setValue('name', selectedActivity?.name);
    setValue('description', selectedActivity?.description);
    setValue('disclaimer', selectedActivity?.disclaimer);
  }, [selectedActivity, setValue]);

  // INITIALIZE UPDATE ACTIVITY MUTATION
  const [
    updateActivity,
    {
      data: updateActivityData,
      error: updateActivityError,
      isError: updateActivityIsError,
      isLoading: updateActivityIsLoading,
      isSuccess: updateActivityIsSuccess,
    },
  ] = useUpdateActivityMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateActivity({
      id: selectedActivity.id,
      name: data.name,
      description: data?.description,
      disclaimer: data?.disclaimer,
    });
  };

  // HANDLE UPDATE ACTIVITY RESPONSE
  useEffect(() => {
    if (updateActivityIsError) {
      const errorResponse =
        (updateActivityError as ErrorResponse)?.data?.message ||
        'An error occurred while updating activity. Please try again.';
      toast.error(errorResponse);
    } else if (updateActivityIsSuccess) {
      toast.success('Activity updated successfully');
      dispatch(setUpdateActivityModal(false));
    }
  }, [
    dispatch,
    updateActivityData,
    updateActivityError,
    updateActivityIsError,
    updateActivityIsSuccess,
  ]);

  return (
    <Modal
      isOpen={updateActivityModal}
      onClose={() => {
        dispatch(setUpdateActivityModal(false));
      }}
      heading={`Update ${selectedActivity.name}`}
    >
      <form
        className="w-full flex flex-col gap-5 min-w-[50vw]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          defaultValue={selectedActivity?.name}
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field }) => {
            return (
              <label className="w-full flex flex-col gap-1">
                <Input
                  {...field}
                  label="Name"
                  required
                  placeholder="Enter activity name"
                />
                {errors?.name && (
                  <InputErrorMessage message={errors?.name?.message} />
                )}
              </label>
            );
          }}
        />{' '}
        <fieldset className="grid grid-cols-2 gap-4 w-full">
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
              dispatch(setUpdateActivityModal(false));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {updateActivityIsLoading ? <Loader /> : 'Update'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default UpdateActivity;
