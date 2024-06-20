import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import { accommodationOptions, bookingDaysOptions } from '@/constants/bookings.constants';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { formatDate } from '@/helpers/strings';
import validateInputs from '@/helpers/validations';
import { useCreateBookingPersonMutation } from '@/states/apiSlice';
import {
  addBookingPerson,
  setCreateBookingPersonModal,
} from '@/states/features/bookingPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateBookingPerson = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createBookingPersonModal } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { booking } = useSelector((state: RootState) => state.booking);

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  // INITIALIZE CREATE BOOKING PERSON MUTATION
  const [
    createBookingPerson,
    {
      isLoading: createBookingPersonIsLoading,
      error: createBookingPersonError,
      isSuccess: createBookingPersonIsSuccess,
      isError: createBookingPersonIsError,
      data: createBookingPersonData,
    },
  ] = useCreateBookingPersonMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createBookingPerson({
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      nationality: data?.nationality,
      residence: data?.residence,
      bookingId: booking?.id,
      email: data?.email,
      phone: data?.phone,
      accomodation: data?.accomodation,
      endDate:
        Number(data?.numberOfDays) > 0
          ? moment(booking?.startDate).add(Number(data?.numberOfDays), 'd').format()
          : null,
    })
  };

  // HANDLE CREATE BOOKING PERSON SUCCESS
  useEffect(() => {
    if (createBookingPersonIsError) {
      if ((createBookingPersonError as ErrorResponse).status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((createBookingPersonError as ErrorResponse).data.message);
      }
    } else if (createBookingPersonIsSuccess) {
      reset();
      toast.success(
        `${createBookingPersonData?.data?.name} added successfully`
      );
      dispatch(addBookingPerson(createBookingPersonData?.data));
      dispatch(setCreateBookingPersonModal(false));
    }
  }, [
    createBookingPersonData,
    createBookingPersonError,
    createBookingPersonIsError,
    createBookingPersonIsSuccess,
    dispatch,
    reset,
  ]);

  return (
    <Modal
      isOpen={createBookingPersonModal}
      onClose={() => {
        dispatch(setCreateBookingPersonModal(false));
      }}
      heading={`Add Person to "${booking?.name} - ${formatDate(
        booking?.startDate
      )}"`}
      className="min-w-[50%]"
    >
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    placeholder="Enter full name"
                    label="Full names"
                    required
                    {...field}
                  />
                  {errors?.name && (
                    <InputErrorMessage message={errors.name.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{ required: 'Date of birth is required' }}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    type="date"
                    label="Date of birth"
                    required
                    toDate={new Date()}
                    {...field}
                  />
                  {errors?.dateOfBirth && (
                    <InputErrorMessage message={errors.dateOfBirth.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="nationality"
            control={control}
            rules={{ required: `Select ${watch('name')}'s nationality` }}
            defaultValue={'RW'}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Select
                    {...field}
                    label="Nationality"
                    required
                    options={COUNTRIES?.map((country) => {
                      return { label: country?.name, value: country?.code };
                    })}
                    placeholder="Select nationality"
                  />
                  {errors?.nationality && (
                    <InputErrorMessage message={errors.nationality.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="residence"
            control={control}
            rules={{ required: `Select ${watch('name')}'s residence` }}
            defaultValue={'RW'}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Select
                    {...field}
                    label="Residence"
                    required
                    options={COUNTRIES?.map((country) => {
                      return { label: country?.name, value: country?.code };
                    })}
                    placeholder="Select residence"
                  />
                  {errors?.residence && (
                    <InputErrorMessage message={errors.residence.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Select
                    label="Gender (optional)"
                    {...field}
                    options={genderOptions}
                  />
                </label>
              );
            }}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Phone (optional)"
                    placeholder="Enter phone number"
                  />
                </label>
              );
            }}
          />
          <Controller
            name="email"
            rules={{
              validate: (value) => {
                if (!value) return true;
                return (
                  validateInputs(value, 'email') || 'Invalid email address'
                );
              },
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Email (optional)"
                    placeholder="Enter email address"
                  />
                  {errors?.email && (
                    <InputErrorMessage message={errors.email.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="numberOfDays"
            rules={{ required: 'Enter your entrance date' }}
            control={control}
            defaultValue={'0'}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    placeholder="Select number of days"
                    options={bookingDaysOptions}
                    {...field}
                    label="Number of days (if applicable)"
                  />
                  {errors.startDate && (
                    <InputErrorMessage message={errors.startDate.message} />
                  )}
                </label>
              );
            }}
          />
          {watch('numberOfDays') !== '0' && (
            <Controller
              name="accomodation"
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1">
                    <Select
                      {...field}
                      label="Accomodation"
                      placeholder="Select accomodation"
                      options={accommodationOptions}
                    />
                  </label>
                );
              }}
            />
          )}
        </fieldset>
        <menu className="flex items-center gap-3 justify-between">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateBookingPersonModal(false));
            }}
            danger
          >
            Cancel
          </Button>
          <Button submit primary>
            {createBookingPersonIsLoading ? <Loader /> : 'Add person'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateBookingPerson;
