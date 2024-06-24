import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../states/store';
import Modal from '../../components/modals/Modal';
import { setCreateBookingModal } from '../../states/features/bookingSlice';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import { InputErrorMessage } from '../../components/feedback/ErrorLabels';
import Button from '../../components/inputs/Button';
import validateInputs from '@/helpers/validations';
import { useCreateBookingMutation } from '@/states/apiSlice';
import { useEffect } from 'react';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/inputs/Loader';
import moment from 'moment';
import Select from '@/components/inputs/Select';
import {
  accommodationOptions,
  bookingDaysOptions,
  exitGateOptions,
} from '@/constants/bookings.constants';

const CreateBooking = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createBookingModal } = useSelector(
    (state: RootState) => state.booking
  );
  const { booking } = useSelector((state: RootState) => state.booking);

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // INITIALIZE CREATE BOOKING MUTATION
  const [
    createBooking,
    {
      data: createBookingData,
      isLoading: createBookingIsLoading,
      isSuccess: createBookingIsSuccess,
      isError: createBookingIsError,
      error: createBookingError,
    },
  ] = useCreateBookingMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createBooking({
      name: data.name,
      phone: data.phone,
      startDate: data.startDate,
      endDate:
        Number(data?.numberOfDays) > 0
          ? moment(data.startDate).add(Number(data?.numberOfDays), 'd').format()
          : null,
      email: data.email,
      accomodation: data?.accomodation,
      exitGate: data?.exitGate,
      entryGate: data?.entryGate,
      type: booking?.type,
    });
  };

  // HANDLE CREATE BOOKING RESPONSE
  useEffect(() => {
    if (createBookingIsError) {
      if ((createBookingError as ErrorResponse).status === 500) {
        toast.error((createBookingError as ErrorResponse).data.message);
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } else if (createBookingIsSuccess) {
      toast.success('Booking created successfully');
      dispatch(setCreateBookingModal(false));
      navigate(`/bookings/${createBookingData?.data?.id}/create`);
      window.location.reload();
    }
  }, [
    createBookingData,
    createBookingError,
    createBookingIsError,
    createBookingIsSuccess,
    dispatch,
    navigate,
  ]);

  return (
    <Modal
      isOpen={createBookingModal}
      onClose={() => {
        dispatch(setCreateBookingModal(false));
      }}
      heading="Create booking"
      headingClassName="text-xl"
    >
      <section className="flex flex-col gap-6 w-[60vw] max-[500px]:w-[80vw]">
        <h3 className="text-primary font-medium text-md max-[600px]:text-[15px] max-[600px]:text-center ">
          Add primary information that will help us accomodate for your booking.
          The next steps will be to add activities and other details. Your
          booking will be confirmed once you provide all the necessary
          information.
        </h3>
        <article>
          <h1>Step 1 of {booking?.type === 'registration' ? '2' : '3'}</h1>
        </article>
        <form
          className="flex flex-col gap-4 relative w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="grid grid-cols-2 w-full gap-4 max-[700px]:grid-cols-1">
            <Controller
              name="name"
              rules={{ required: 'Name is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      {...field}
                      label="Name or Tour Company Name"
                      required
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <InputErrorMessage message={errors.name.message} />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="phone"
              rules={{
                required: 'Phone number is required',
                validate: (value) => {
                  return validateInputs(value, 'tel') || 'Invalid phone number';
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      {...field}
                      label="Phone number"
                      required
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <InputErrorMessage message={errors.phone.message} />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                validate: (value) => {
                  return (
                    validateInputs(value, 'email') || 'Invalid email address'
                  );
                },
              }}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      {...field}
                      label="Email"
                      required
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <InputErrorMessage message={errors.email.message} />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="startDate"
              rules={{ required: 'Enter your entrance date' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Input
                      type="date"
                      {...field}
                      label="Entrance date"
                      required
                      fromDate={moment().add(1, 'd').toDate()}
                    />
                    {errors.startDate && (
                      <InputErrorMessage message={errors.startDate.message} />
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
                      label="Number of days"
                      required
                    />
                    {errors.startDate && (
                      <InputErrorMessage message={errors.startDate.message} />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="entryGate"
              rules={{ required: 'Select entry gate' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="flex flex-col gap-1 w-full">
                    <Select
                      {...field}
                      label="Select entry gate"
                      placeholder="Select entry gate"
                      required
                      options={exitGateOptions}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    />
                    {errors?.entryGate && (
                      <InputErrorMessage message={errors.entryGate.message} />
                    )}
                  </label>
                );
              }}
            />
            {watch('numberOfDays') === '0' && (
              <Controller
                name="exitGate"
                rules={{ required: 'Select exit gate' }}
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-full">
                      <Select
                        {...field}
                        label="Select exit gate"
                        placeholder="Select exit gate"
                        required
                        options={exitGateOptions}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      />
                      {errors?.exitGate && (
                        <InputErrorMessage message={errors.exitGate.message} />
                      )}
                    </label>
                  );
                }}
              />
            )}
            {watch('numberOfDays') !== '0' && (
              <Controller
                name="accomodation"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1 w-full">
                      <Select
                        options={accommodationOptions}
                        {...field}
                        label="Select place of accomodation"
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        placeholder="Select accomodation"
                      />
                    </label>
                  );
                }}
              />
            )}
          </fieldset>
          <menu className="flex w-full items-center gap-3 justify-between">
            <Button
              danger
              onClick={(e) => {
                e.preventDefault();
                dispatch(setCreateBookingModal(false));
              }}
            >
              Cancel
            </Button>
            <Button submit primary>
              {createBookingIsLoading ? <Loader /> : 'Save & continue'}
            </Button>
          </menu>
        </form>
      </section>
    </Modal>
  );
};

export default CreateBooking;
