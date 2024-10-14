import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import OTPInputs from '@/components/inputs/OTPInputs';
import PublicLayout from '@/containers/PublicLayout';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import {
  ErrorResponse,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import {
  useRequestResetPasswordMutation,
  useVerifyPasswordResetMutation,
} from '@/states/apiSlice';
import { toast } from 'react-toastify';
import Loader from '@/components/inputs/Loader';

const VerifyPasswordReset = () => {
  // STATE VARIABLES
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const { search } = useLocation();
  const navigate = useNavigate();

  // GET QUERY PARAMS
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // INITIALIZE VERIFY PASSWORD RESET MUTATION
  const [
    verifyPasswordReset,
    {
      data: verifyPasswordResetData,
      isLoading: verifyPasswordResetIsLoading,
      isSuccess: verifyPasswordResetIsSuccess,
      isError: verifyPasswordResetIsError,
      error: verifyPasswordResetError,
    },
  ] = useVerifyPasswordResetMutation();

  // INITIALIZE REQUEST RESET PASSWORD MUTATION
  const [
    requestResetPassword,
    {
      isLoading: requestResetPasswordIsLoading,
      isSuccess: requestResetPasswordIsSuccess,
      isError: requestResetPasswordIsError,
      error: requestResetPasswordError,
    },
  ] = useRequestResetPasswordMutation();

  // HANDLE REQUEST RESET PASSWORD RESPONSE
  useEffect(() => {
    if (requestResetPasswordIsSuccess) {
      toast.success('OTP resent successfully');
    } else if (requestResetPasswordIsError) {
      const errorResponse = (requestResetPasswordError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || 'An error occurred. Please try again.');
    }
  }, [
    requestResetPasswordIsSuccess,
    requestResetPasswordIsError,
    requestResetPasswordError,
  ]);

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    verifyPasswordReset({ email: queryParams?.email, otp: data?.otp });
  };

  // HANDLE VERIFY PASSWORD RESET RESPONSE
  useEffect(() => {
    if (verifyPasswordResetIsSuccess) {
      toast.success('OTP verified successfully');
      navigate(
        `/auth/reset-password?token=${verifyPasswordResetData?.data?.token}`
      );
    } else if (verifyPasswordResetIsError) {
      const errorResponse = (verifyPasswordResetError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || 'An error occurred. Please try again.');
    }
  }, [
    verifyPasswordResetIsSuccess,
    navigate,
    verifyPasswordResetIsError,
    verifyPasswordResetError,
    verifyPasswordResetData?.data?.token,
  ]);

  return (
    <PublicLayout>
      <main className="w-full mx-auto flex flex-col gap-5 h-[90vh] items-center justify-center max-[900px]:w-[100vw] bg-background">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-6 rounded-md shadow-md items-center gap-5 bg-white w-[40%] max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[800px]:w-[60%] max-[700px]:w-[70%] max-[600px]:w-[80%] max-[500px]:w-[85%]"
        >
          <h1 className="text-primary font-medium text-lg uppercase">
            Reset password
          </h1>
          <p>Enter the 6-digit code sent to your email address.</p>

          <Controller
            name="otp"
            control={control}
            rules={{
              required: 'OTP is required',
              validate: (value) => value.length === 6 || 'OTP must be 6 digits',
            }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1 items-center">
                  <OTPInputs length={6} {...field} />
                  {errors?.otp && (
                    <InputErrorMessage message={errors?.otp?.message} />
                  )}
                </label>
              );
            }}
          />
          <menu className="w-full flex flex-col items-center gap-3 justify-between">
            <Button submit primary>
              {verifyPasswordResetIsLoading ? <Loader /> : 'Submit'}
            </Button>
            <Link
              to={`#`}
              onClick={(e) => {
                e.preventDefault();
                requestResetPassword({ email: queryParams?.email });
              }}
              className="text-sm text-primary underline"
            >
              {requestResetPasswordIsLoading ? <Loader className='text-primary' /> : 'Resend OTP'}
            </Link>
            <Link to="/auth/login" className="text-sm text-primary underline">
              Cancel
            </Link>
          </menu>
        </form>
      </main>
    </PublicLayout>
  );
};

export default VerifyPasswordReset;
