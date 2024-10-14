import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import PublicLayout from '@/containers/PublicLayout';
import validateInputs from '@/helpers/validations.helper';
import { useRequestResetPasswordMutation } from '@/states/apiSlice';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RequestResetPassword = () => {
  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = useForm();
  const { email } = watch();

  // NAVIGATE
  const navigate = useNavigate();

  // INITIALIZE REQUEST RESET PASSWORD
  const [
    requestResetPassword,
    {
      isLoading: requestResetPasswordIsLoading,
      isError: requestResetPasswordIsError,
      error: requestResetPasswordError,
      isSuccess: requestResetPasswordIsSuccess,
      reset: requestResetPasswordReset,
    },
  ] = useRequestResetPasswordMutation();

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    requestResetPassword({ email: data?.email });
  };

  // HANDLE REQUEST RESET PASSWORD RESPONSE
  useEffect(() => {
    if (requestResetPasswordIsSuccess) {
      toast.success('Reset password email sent successfully');
      requestResetPasswordReset();
      navigate(`/auth/verify-password-reset?email=${email}`);
      reset({
        email: '',
      });
    } else if (requestResetPasswordIsError) {
      const errorResponse = (requestResetPasswordError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || 'An error occurred. Please try again.');
    }
  }, [
    email,
    navigate,
    requestResetPassword,
    requestResetPasswordError,
    requestResetPasswordIsError,
    requestResetPasswordIsSuccess,
    requestResetPasswordReset,
    reset,
  ]);

  return (
    <PublicLayout>
      <main className="w-full mx-auto flex flex-col gap-5 h-[90vh] items-center justify-center max-[900px]:w-[100vw] bg-background">
        <form
          className="w-[40%] bg-white mx-auto bg-secondary flex flex-col items-center gap-5 p-8 rounded-md shadow-xl max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[800px]:w-[60%] max-[700px]:w-[70%] max-[600px]:w-[80%] max-[500px]:w-[85%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="uppercase text-primary font-medium text-lg">
            Request reset password
          </h1>
          <p className="text-slate-950 text-[14px] text-center">
            Enter the email address associated with your account and we'll send
            you a link to reset your password.
          </p>
          <fieldset className="w-full flex flex-col gap-4 items-center">
            <Controller
              name="email"
              rules={{
                required: 'Email is required',
                validate: (value) =>
                  validateInputs(value, 'email') || 'Invalid email address',
              }}
              control={control}
              render={({ field }) => (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Email"
                    required
                    onChange={(e) => {
                      field.onChange(e);
                      trigger('email');
                    }}
                  />
                  {errors.email && (
                    <InputErrorMessage
                      message={errors.email.message as string}
                    />
                  )}
                </label>
              )}
            />
            <menu className="flex items-center gap-2 justify-center flex-col">
              <Button submit primary disabled={Object.keys(errors).length > 0}>
                {requestResetPasswordIsLoading ? <Loader /> : 'Send reset link'}
              </Button>
              <Link
                to={'#'}
                className="text-primary text-sm underline flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  reset({
                    email: '',
                  });
                  navigate('/auth/login');
                }}
              >
                Cancel
              </Link>
            </menu>
          </fieldset>
        </form>
      </main>
    </PublicLayout>
  );
};

export default RequestResetPassword;
