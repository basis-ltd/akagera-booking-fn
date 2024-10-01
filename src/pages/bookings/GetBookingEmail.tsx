import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import {
  maskEmail,
} from '@/helpers/booking.helper';
import validateInputs from '@/helpers/validations.helper';
import {
  useLazyFindBookingEmailQuery,
  useRequestBookingOtpMutation,
  useVerifyBookingOtpMutation,
} from '@/states/apiSlice';
import {
  setDraftBookingsList,
  setGetBookingEmailModal,
} from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GetBookingEmail = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingEmailModal, draftBookingsList } = useSelector(
    (state: RootState) => state.booking
  );

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    trigger
  } = useForm();

  const { selectOption, email, phone, referenceId } = watch();

  // INITIALIZE FIND BOOKING EMAIL QUERY
  const [
    findBookingEmail,
    {
      data: bookingEmailData,
      error: bookingEmailError,
      isSuccess: bookingEmailIsSuccess,
      isError: bookingEmailIsError,
      isFetching: bookingEmailIsFetching,
    },
  ] = useLazyFindBookingEmailQuery();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    findBookingEmail({
      referenceId: data?.referenceId,
      email: data?.email,
      phone: data?.phone,
    });
  };

  // HANDLE FETCH BOOKINGS RESPONSE
  useEffect(() => {
    if (bookingEmailIsSuccess) {
      setValue('bookingEmail', maskEmail(bookingEmailData?.data?.email));
    }
    if (bookingEmailIsError && bookingEmailError) {
      const errorResponse =
        (bookingEmailError as ErrorResponse)?.data?.message ||
        'An error occured while finding booking email. Please try again';
      toast.error(errorResponse);
    }
  }, [
    bookingEmailIsSuccess,
    bookingEmailIsError,
    bookingEmailData,
    bookingEmailError,
    dispatch,
    setValue,
  ]);

  // BOOKING SELECT OPTIONS
  const bookingSelectOptions = [
    { label: 'Reference ID', value: 'referenceId' },
    { label: 'Email address', value: 'email' },
    { label: 'Phone number', value: 'phone' },
  ];

  // INITIALIZE REQUEST OTP MUTATION
  const [requestOtp, {
    error: requestOtpError,
    isSuccess: requestOtpIsSuccess,
    isError: requestOtpIsError,
    isLoading: requestOtpIsLoading,
    reset: requestOtpReset
  }] = useRequestBookingOtpMutation();

  // HANDLE REQUEST OTP RESPONSE
  useEffect(() => {
    if (requestOtpIsSuccess) {
      setValue('otp', '');
      toast.success('OTP sent to email address successfully');
    } else if (requestOtpIsError && requestOtpError) {
      const errorResponse =
        (requestOtpError as ErrorResponse)?.data?.message ||
        'An error occured while sending OTP. Please try again';
      toast.error(errorResponse);
    }
  }, [
    navigate,
    requestOtpError,
    requestOtpIsError,
    requestOtpIsSuccess,
    requestOtpReset,
    setValue,
  ]);

  // INITIALIZE VERIFY BOOKING OTP MUTATION
  const [verifyBookingOtp, {
    data: verifyBookingOtpData,
    error: verifyBookingOtpError,
    isError: verifyBookingOtpIsError,
    isSuccess: verifyBookingOtpIsSuccess,
    isLoading: verifyBookingOtpIsLoading,
    reset: verifyBookingOtpReset
  }] = useVerifyBookingOtpMutation();

  // HANDLE VERIFY OTP RESPONSE
  useEffect(() => {
    if (verifyBookingOtpIsError) {
      const errorResponse =
        (verifyBookingOtpError as ErrorResponse)?.data?.message ||
        'An error occured while verifying OTP. Please try again';
      toast.error(errorResponse);
    } else if (verifyBookingOtpIsSuccess) {
      dispatch(setGetBookingEmailModal(false));
      console.log(verifyBookingOtpData?.data);
      verifyBookingOtpReset();
      navigate(
        `/bookings/search?token=${
          verifyBookingOtpData?.data?.token
        }&${selectOption}=${email || phone || referenceId}`
      );
    }
  }, [
    dispatch,
    email,
    navigate,
    phone,
    referenceId,
    selectOption,
    verifyBookingOtpData,
    verifyBookingOtpError,
    verifyBookingOtpIsError,
    verifyBookingOtpIsSuccess,
    verifyBookingOtpReset,
  ]);

  return (
    <Modal
      isOpen={bookingEmailModal}
      onClose={() => {
        reset({
          type: '',
          selectOption: '',
          referenceId: '',
          email: '',
          phone: '',
        });
        dispatch(setGetBookingEmailModal(false));
        dispatch(setDraftBookingsList([]));
      }}
      heading={
        draftBookingsList?.length > 0 && bookingEmailIsSuccess
          ? 'List of unfinished bookings/registrations'
          : 'Find bookings/registrations in progress to complete'
      }
      className="min-w-[90vw] md:min-w-[60vw] !w-[90vw] md:!w-[60vw]"
    >
      <form
        className={`flex flex-col gap-4 w-full min-w-[50vw]`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset
          className={`${
            draftBookingsList?.length > 0 && bookingEmailIsSuccess && 'hidden'
          } w-full flex flex-col gap-4`}
        >
          <Controller
            name="selectOption"
            rules={{
              required:
                'Select the option you will use to find bookings in progress',
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1">
                  <Select
                    placeholder="Select option"
                    label="Select booking retrieval option"
                    options={bookingSelectOptions}
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      requestOtpReset();
                      setValue('otp', '');
                    }}
                  />
                  {errors?.selectOption && (
                    <InputErrorMessage message={errors.selectOption.message} />
                  )}
                </label>
              );
            }}
          />
          <menu className="flex flex-col gap-2 w-full">
            {selectOption === 'referenceId' && (
              <Controller
                name="referenceId"
                control={control}
                rules={{
                  required:
                    selectOption === 'referenceId' ||
                    'Enter reference ID to continue',
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Reference ID"
                        required
                        placeholder="Enter reference ID"
                        {...field}
                      />
                      {errors?.referenceId && (
                        <InputErrorMessage
                          message={errors.referenceId.message}
                        />
                      )}
                    </label>
                  );
                }}
              />
            )}
            {selectOption === 'email' && (
              <Controller
                name="email"
                control={control}
                rules={{
                  required:
                    selectOption === 'email' ||
                    'Enter email address to continue',
                  validate: (value) => {
                    if (selectOption === 'email') {
                      return validateInputs(value, 'email') || 'Invalid email';
                    } else return true;
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Email address"
                        required
                        placeholder="Enter email address"
                        {...field}
                      />
                      {errors?.email && (
                        <InputErrorMessage message={errors.email.message} />
                      )}
                    </label>
                  );
                }}
              />
            )}
            {selectOption === 'phone' && (
              <Controller
                name="phone"
                control={control}
                rules={{
                  required:
                    selectOption === 'phone' ||
                    'Enter phone number to continue',
                  validate: (value) => {
                    if (selectOption === 'phone') {
                      return (
                        validateInputs(value, 'tel') || 'Invalid phone number'
                      );
                    } else return true;
                  },
                }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-1">
                      <Input
                        label="Phone number"
                        required
                        placeholder="Enter phone number"
                        {...field}
                      />
                      {errors?.phone && (
                        <InputErrorMessage message={errors.phone.message} />
                      )}
                    </label>
                  );
                }}
              />
            )}
          </menu>
        </fieldset>

        {(bookingEmailIsSuccess || requestOtpIsSuccess) && (
          <section className="w-full flex flex-col gap-3">
            <p className="text-[14px]">
              Below is an email address associated with the booking(s) we found
              in progress. Click the button below to receive an OTP to continue.
            </p>
            <fieldset className="flex w-full items-end gap-3">
              <Controller
                name="bookingEmail"
                control={control}
                render={({ field }) => {
                  return <Input label="Email address" readOnly {...field} />;
                }}
              />{' '}
              <Button
                className="w-[20%] mb-[6px]"
                primary
                onClick={(e) => {
                  e.preventDefault();
                  requestOtp({
                    email: bookingEmailData?.data?.email,
                  });
                }}
              >
                {requestOtpIsLoading ? <Loader /> : 'Request OTP'}
              </Button>
            </fieldset>
            {requestOtpIsSuccess && (
              <Controller
                name="otp"
                control={control}
                rules={{
                  required: 'Enter OTP to continue',
                }}
                render={({ field }) => {
                  return (
                    <menu className="w-full flex items-end gap-2">
                      <label className="flex flex-col gap-1 w-full">
                        <Input
                          label="OTP"
                          required
                          placeholder="Enter OTP"
                          {...field}
                        />
                        {errors?.otp && (
                          <InputErrorMessage message={errors.otp.message} />
                        )}
                      </label>
                      <Button
                        primary
                        onClick={(e) => {
                          e.preventDefault();
                          if (!field.value) {
                            trigger('otp');
                            return;
                          }
                          verifyBookingOtp({
                            email: bookingEmailData?.data?.email,
                            otp: field.value,
                          });
                        }}
                        className="w-[20%] mb-[6px]"
                      >
                        {verifyBookingOtpIsLoading ? <Loader /> : 'Verify OTP'}
                      </Button>
                    </menu>
                  );
                }}
              />
            )}
          </section>
        )}
        <menu className="flex items-center gap-3 justify-between flex-wrap">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(setDraftBookingsList([]));
              dispatch(setGetBookingEmailModal(false));
            }}
            className="w-full md:w-auto"
          >
            Cancel
          </Button>
          {requestOtpIsSuccess ? (
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
              }}
              className="w-full"
            >
              Continue
            </Button>
          ) : (
            <Button submit primary className="w-full md:w-auto">
              {bookingEmailIsFetching ? <Loader /> : 'Find Booking(s)'}
            </Button>
          )}
        </menu>
      </form>
    </Modal>
  );
};

export default GetBookingEmail;
