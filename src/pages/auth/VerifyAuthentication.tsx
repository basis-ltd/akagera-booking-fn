import store from 'store';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import OTPInputs from '@/components/inputs/OTPInputs';
import PublicLayout from '@/containers/PublicLayout';
import {
  useRequestOtpMutation,
  useVerifyAuthenticationMutation,
} from '@/states/apiSlice';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import Loader from '@/components/inputs/Loader';
import { setToken, setUser } from '@/states/features/userSlice';

const VerifyAuthentication = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const navigate = useNavigate();

  // CHECK IF EMAIL IS STORED
  useEffect(() => {
    if (!store.get('email')) {
      toast.error('Email not found. Please login again.');
      navigate('/auth/login');
    }
  }, [navigate]);

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // INITIALIZE VERIFY AUTH MUTATION
  const [
    verifyAuth,
    {
      isLoading: verifyAuthIsLoading,
      isError: verifyAuthIsError,
      error: verifyAuthError,
      isSuccess: verifyAuthIsSuccess,
      data: verifyAuthData,
    },
  ] = useVerifyAuthenticationMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    verifyAuth({
      otp: data?.otp,
      email: store.get('email'),
    });
  };

  // HANDLE VERIFY AUTH RESPONSE
  useEffect(() => {
    if (verifyAuthIsSuccess) {
      dispatch(setUser(verifyAuthData?.data?.user));
      dispatch(setToken(verifyAuthData?.data?.token));
      toast.success('Login successful, redirecting...');
      store.clearAll();
      navigate('/dashboard');
    } else if (verifyAuthIsError) {
      const errorResponse = (verifyAuthError as ErrorResponse)?.data?.message;
      toast.error(errorResponse || 'An error occurred. Please try again.');
    }
  }, [
    dispatch,
    navigate,
    verifyAuthData,
    verifyAuthError,
    verifyAuthIsError,
    verifyAuthIsSuccess,
  ]);

  // INITIALIZE REQUEST OTP MUTATION
  const [
    requestOtp,
    {
      isLoading: requestOtpIsLoading,
      isError: requestOtpIsError,
      error: requestOtpError,
      isSuccess: requestOtpIsSuccess,
      data: requestOtpData,
    },
  ] = useRequestOtpMutation();

  // HANDLE REQUEST OTP RESPONSE
  useEffect(() => {
    if (requestOtpIsSuccess) {
      toast.success('New OTP sent to your email.');
    } else if (requestOtpIsError) {
      const errorResponse = (requestOtpError as ErrorResponse)?.data?.message;
      toast.error(errorResponse || 'An error occurred. Please try again.');
    }
  }, [requestOtpData, requestOtpError, requestOtpIsError, requestOtpIsSuccess]);

  return (
    <PublicLayout>
      <main className="w-full mx-auto flex flex-col gap-5 h-[80vh] items-center justify-center max-[900px]:w-[100vw]">
        <form
          className="flex flex-col items-center gap-4 w-[40%] mx-auto bg-secondary p-8 rounded-md shadow-xl max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[800px]:w-[60%] max-[700px]:w-[70%] max-[600px]:w-[80%] max-[500px]:w-[85%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <menu className="w-full flex flex-col gap-2 items-center">
            <h1 className="uppercase text-primary font-medium text-lg">
              Verify authentication
            </h1>
            <p className="text-slate-950 text-[14px] text-center">
              Enter the One-time Password sent to {store.get('email')}. Please
              check yowur spam folder if you do not find the email in your
              inbox.
            </p>
          </menu>
          <fieldset className="w-full flex flex-col gap-4 items-center">
            <Controller
              name="otp"
              rules={{ required: 'OTP is required' }}
              control={control}
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
          </fieldset>
          <Link
            to={'#'}
            onClick={(e) => {
              e.preventDefault();
              requestOtp({ email: store.get('email') });
            }}
            className="underline text-[14px] transition-all duration-300 hover:scale-[1.02]"
          >
            {requestOtpIsLoading ? <Loader /> : 'Resend One-time Password'}
          </Link>
          <menu className="w-full flex items-center gap-3 justify-between">
            <Button
              onClick={(e) => {
                e.preventDefault();
                store.clearAll();
                navigate('/auth/login');
              }}
            >
              Cancel
            </Button>
            <Button primary submit>
              {verifyAuthIsLoading ? <Loader /> : 'Verify'}
            </Button>
          </menu>
        </form>
      </main>
    </PublicLayout>
  );
};

export default VerifyAuthentication;
