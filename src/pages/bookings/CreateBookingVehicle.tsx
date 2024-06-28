import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import { COUNTRIES } from '@/constants/countries.constants';
import { vehicleTypes } from '@/constants/vehicles.constants';
import { formatDate } from '@/helpers/strings';
import { useCreateBookingVehicleMutation } from '@/states/apiSlice';
import {
  addBookingVehicle,
  setCreateBookingVehicleModal,
} from '@/states/features/bookingVehicleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateBookingVehicle = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createBookingVehicleModal } = useSelector(
    (state: RootState) => state.bookingVehicle
  );
  const { booking } = useSelector((state: RootState) => state.booking);

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger
  } = useForm();

  // INITIALIZE CREATE BOOKING VEHICLE MUTATION
  const [
    createBookingVehicle,
    {
      isLoading: createBookingVehicleIsLoading,
      error: createBookingVehicleError,
      isSuccess: createBookingVehicleIsSuccess,
      isError: createBookingVehicleIsError,
      data: createBookingVehicleData,
    },
  ] = useCreateBookingVehicleMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createBookingVehicle({
      bookingId: booking?.id,
      registrationCountry: data?.registrationCountry,
      vehicleType: data?.vehicleType,
      vehiclesCount: data?.vehiclesCount,
    });
  };

  // HANDLE CREATE BOOKING VEHICLE RESPONSE
  useEffect(() => {
    if (createBookingVehicleIsError) {
      if ((createBookingVehicleError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occured while adding vehicle to booking. Please try again later.'
        );
      } else {
        toast.error((createBookingVehicleError as ErrorResponse)?.data.message);
      }
    } else if (createBookingVehicleIsSuccess) {
      toast.success(
        `Vehicle with plate number ${createBookingVehicleData?.data?.plateNumber} added to booking successfully.`
      );
      dispatch(addBookingVehicle(createBookingVehicleData?.data));
      reset({
        vehicleType: '',
        registrationCountry: 'RW',
        plateNumber: '',
      });
      dispatch(setCreateBookingVehicleModal(false));
    }
  }, [
    createBookingVehicleIsError,
    createBookingVehicleIsSuccess,
    createBookingVehicleData,
    createBookingVehicleError,
    dispatch,
    reset,
  ]);

  return (
    <Modal
      isOpen={createBookingVehicleModal}
      onClose={() => {
        dispatch(setCreateBookingVehicleModal(false));
      }}
      heading={`Add Vehicle to "${booking?.name} - ${formatDate(
        booking?.startDate
      )}" Booking`}
    >
      <form
        className="flex flex-col gap-4 w-full min-w-[50vw]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-4 w-full">
          <Controller
            name="vehicleType"
            control={control}
            rules={{ required: 'Select vehicle type' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    options={vehicleTypes}
                    {...field}
                    placeholder="Select vehicle type"
                    required
                    label="Select vehicle"
                  />
                  {errors?.vehicleType && (
                    <InputErrorMessage message={errors.vehicleType.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="registrationCountry"
            control={control}
            rules={{ required: 'Select registration country' }}
            defaultValue={'RW'}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    options={COUNTRIES?.map((country) => {
                      return { value: country?.code, label: country?.name };
                    })}
                    {...field}
                    placeholder="Select registration country"
                    required
                    label="Select country of registration"
                  />
                  {errors?.registrationCountry && (
                    <InputErrorMessage
                      message={errors.registrationCountry.message}
                    />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="vehiclesCount"
            control={control}
            rules={{ required: 'Add number of vehicles' }}
            defaultValue={1}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Input
                    label="Number of vehicles"
                    type="number"
                    placeholder="Number of vehicles"
                    {...field}
                    onChange={async (e) => {
                      field.onChange(parseInt(e.target.value));
                      await trigger('vehiclesCount');
                    }}
                  />
                  {errors?.vehiclesCount && (
                    <InputErrorMessage message={errors.vehiclesCount.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              reset();
              dispatch(setCreateBookingVehicleModal(false));
            }}
            danger
          >
            Cancel
          </Button>
          <Button submit primary>
            {createBookingVehicleIsLoading ? <Loader /> : 'Add vehicle'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateBookingVehicle;
