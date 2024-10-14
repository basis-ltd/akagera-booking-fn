import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import {
  setSelectedSettings,
  setUpdateAdminEmailModal,
  setUpdateSettings,
} from '@/states/settingsSlice';
import { RootState, AppDispatch } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useUpdateSettingsMutation } from '@/states/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import validateInputs from '@/helpers/validations.helper';

const UpdateAdminEmail = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateAdminEmailModal, selectedSettings } = useSelector(
    (state: RootState) => state.settings
  );

  // REACT HOOK FORM
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
    trigger
  } = useForm();

  // INITIALIZE UPDATE SETTINGS MUTATION
  const [
    updateSettings,
    {
      data: updateSettingsData,
      isLoading: updateSettingsIsLoading,
      isSuccess: updateSettingsIsSuccess,
      isError: updateSettingsIsError,
      error: updateSettingsError,
      reset: updateSettingsReset,
    },
  ] = useUpdateSettingsMutation();

  // HANDLE FORM SUBMIT
  const onSubmit = (data: FieldValues) => {
    updateSettings({
      id: selectedSettings?.id,
      adminEmail: data?.adminEmail,
      usdRate: selectedSettings?.usdRate,
    });
  };

  // HANDLE UPDATE SETTINGS RESPONSE
  useEffect(() => {
    if (updateSettingsIsError) {
      const errorMessage =
        (updateSettingsError as ErrorResponse)?.data?.message ||
        'An error occurred while updating settings. Please try again.';
      toast.error(errorMessage);
    }
    if (updateSettingsIsSuccess) {
      toast.success('Admin email updated successfully.');
      dispatch(setUpdateSettings(updateSettingsData?.data));
      dispatch(setUpdateAdminEmailModal(false));
      dispatch(setSelectedSettings(undefined));
      updateSettingsReset();
    }
  }, [
    dispatch,
    updateSettingsData?.data,
    updateSettingsError,
    updateSettingsIsError,
    updateSettingsIsSuccess,
    updateSettingsReset,
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    setValue('adminEmail', selectedSettings?.adminEmail);
  }, [selectedSettings, setValue]);

  return (
    <Modal
      isOpen={updateAdminEmailModal}
      onClose={() => {
        dispatch(setUpdateAdminEmailModal(false));
        dispatch(setSelectedSettings(undefined));
      }}
      heading="Update Admin Email"
      headingClassName="text-center"
      className="min-w-[40vw]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="adminEmail"
          rules={{
            required: 'Admin Email is required',
            validate: (value) =>
              validateInputs(value, 'email') ||
              'Invalid email address. Please enter a valid email address.',
          }}
          render={({ field }) => (
            <label className="w-full flex flex-col gap-1">
              <Input {...field} label="Admin Email" onChange={(e) => {
                field.onChange(e);
                trigger('adminEmail');
              }} />
              {errors.adminEmail && (
                <InputErrorMessage message={errors?.adminEmail?.message} />
              )}
            </label>
          )}
        />
        <Button primary submit className="w-full" disabled={Object.keys(errors).length > 0}>
          {updateSettingsIsLoading ? <Loader /> : 'Update'}
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateAdminEmail;
