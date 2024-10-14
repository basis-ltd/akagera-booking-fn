import store from 'store';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import PublicLayout from '@/containers/PublicLayout';
import { useResetPasswordMutation } from '@/states/apiSlice';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { ErrorResponse, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/inputs/Loader';

const ResetPassword = () => {
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

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm();
  const { password } = watch();

  // INITIALIZE RESET PASSWORD MUTATION
  const [
    resetPassword,
    {
      isLoading: resetPasswordIsLoading,
      isSuccess: resetPasswordIsSuccess,
      isError: resetPasswordIsError,
      error: resetPasswordError,
    },
  ] = useResetPasswordMutation();

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    resetPassword({ token: queryParams?.token, password: data?.password });
  };

  // HANDLE RESET PASSWORD RESPONSE
  useEffect(() => {
    if (resetPasswordIsSuccess) {
      store.clearAll();
      toast.success('Password reset successfully. Please login.');
      navigate('/auth/login');
    } else if (resetPasswordIsError) {
      const errorResponse = (resetPasswordError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || 'An error occurred. Please try again.');
    }
  }, [
    resetPasswordIsSuccess,
    resetPasswordIsError,
    resetPasswordError,
    navigate,
  ]);

  return (
    <PublicLayout>
      <main className="w-full mx-auto flex flex-col gap-5 h-[90vh] items-center justify-center max-[900px]:w-[100vw] bg-background">
        <form
          className="w-[40%] bg-white mx-auto bg-secondary flex flex-col items-center gap-5 p-8 rounded-md shadow-xl max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[800px]:w-[60%] max-[700px]:w-[70%] max-[600px]:w-[80%] max-[500px]:w-[85%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <article className="w-full flex flex-col gap-1 items-center">
            <h1 className="uppercase text-primary font-medium text-lg">
              Reset password
            </h1>
            <p className="text-slate-700 text-[14px] text-center">
              Enter your new password below.
            </p>
          </article>
          <fieldset className="w-full flex flex-col gap-4 items-center">
            <Controller
              name="password"
              rules={{ required: 'Password is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1 items-start">
                    <Input
                      type="password"
                      {...field}
                      label="Password"
                      placeholder="Enter your new password"
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('password');
                        trigger('confirmPassword');
                      }}
                    />
                    {errors?.password && (
                      <InputErrorMessage message={errors?.password?.message} />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="confirmPassword"
              rules={{
                required: 'Confirm password is required',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1 items-start">
                    <Input
                      type="password"
                      {...field}
                      placeholder="Confirm your password"
                      onChange={(e) => {
                        field.onChange(e);
                        trigger('password');
                        trigger('confirmPassword');
                      }}
                      label="Confirm Password"
                    />
                    {errors?.confirmPassword && (
                      <InputErrorMessage
                        message={errors?.confirmPassword?.message}
                      />
                    )}
                  </label>
                );
              }}
            />
          </fieldset>
          <menu className="w-full flex items-center gap-3 justify-between">
            <Button
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth/login');
              }}
            >
              Cancel
            </Button>
            <Button primary submit>
              {resetPasswordIsLoading ? <Loader /> : 'Reset password'}
            </Button>
          </menu>
        </form>
      </main>
    </PublicLayout>
  );
};

export default ResetPassword;
