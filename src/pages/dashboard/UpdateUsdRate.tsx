import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { useUpdateSettingsMutation } from '@/states/apiSlice';
import {
  setSelectedSettings,
  setUpdateSettings,
  setUpdateUsdRateModal,
} from '@/states/settingsSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UpdateUsdRate = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { updateUsdRateModal, selectedSettings } = useSelector(
    (state: RootState) => state.settings
  );

  // REACT HOOK FORM
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
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

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateSettings({
      id: selectedSettings?.id,
      usdRate: data?.usdRate,
      adminEmail: selectedSettings?.adminEmail,
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
      toast.success('Settings updated successfully.');
      dispatch(setUpdateSettings(updateSettingsData?.data));
      dispatch(setUpdateUsdRateModal(false));
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
    if (selectedSettings) {
      setValue('usdRate', selectedSettings?.usdRate);
    }
  }, [selectedSettings, setValue]);

  return (
    <Modal
      isOpen={updateUsdRateModal}
      onClose={() => {
        dispatch(setUpdateUsdRateModal(false));
        dispatch(setSelectedSettings(undefined));
      }}
      heading="Update USD Rate"
      className="min-w-[50vw]"
      headingClassName='text-center'
    >
      <form
        className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35vw] mx-auto flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="w-full grid grid-cols-1 gap-5">
          <Controller
            name="usdRate"
            control={control}
            rules={{ required: 'USD Rate is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    placeholder="Enter USD Rate"
                    required
                    type="number"
                    label="USD Rate"
                  />
                  {errors.usdRate && (
                    <InputErrorMessage message={errors?.usdRate?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <Button primary submit className="w-full">
          {updateSettingsIsLoading ? <Loader /> : 'Update'}
        </Button>
      </form>
    </Modal>
  );
};

export default UpdateUsdRate;
