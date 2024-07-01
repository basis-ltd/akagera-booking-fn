import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import akageraLogo from '/public/akagera_logo.webp';
import { useLoginMutation } from '@/states/apiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { AppDispatch } from '@/states/store';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '@/states/features/userSlice';
import Loader from '@/components/inputs/Loader';
import PublicLayout from '@/containers/PublicLayout';
import validateInputs from '@/helpers/validations.helper';

const Login = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // INITIALIZE LOGIN MUTATION
  const [
    login,
    {
      isLoading: loginIsLoading,
      isError: loginIsError,
      error: loginError,
      isSuccess: loginIsSuccess,
      data: loginData,
    },
  ] = useLoginMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    login({
      email: data?.username,
      password: data?.password,
    });
  };

  // HANDLE LOGIN RESPONSE
  useEffect(() => {
    if (loginIsSuccess) {
      dispatch(setUser(loginData?.data?.user));
      dispatch(setToken(loginData?.data?.token));
      toast.success('Login successful, redirecting...');
      navigate('/dashboard/registrations');
    }
    if (loginIsError) {
      if ((loginError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred, please try again later');
      } else {
        toast.error((loginError as ErrorResponse)?.data?.message);
      }
    }
  }, [
    loginIsSuccess,
    loginIsError,
    dispatch,
    loginData?.data?.user,
    loginData?.data?.token,
    loginError,
    navigate,
  ]);

  return (
    <PublicLayout>
      <main className="w-full mx-auto flex flex-col gap-5 h-[80vh] items-center justify-center max-[900px]:w-[100vw]">
        <form
          className="flex flex-col gap-4 w-[40%] mx-auto bg-secondary p-8 rounded-md shadow-xl max-[1000px]:w-[45%] max-[900px]:w-[50%] max-[800px]:w-[60%] max-[700px]:w-[70%] max-[600px]:w-[80%] max-[500px]:w-[85%]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <figure className="w-full flex flex-col gap-5 my-4">
            <img
              src={akageraLogo}
              alt="Akagera Logo"
              className="w-[100px] h-auto mx-auto"
            />
            <h1 className="text-lg font-semibold text-center uppercase">
              Log into your account to continue
            </h1>
          </figure>
          <fieldset className="w-full flex flex-col gap-4">
            <Controller
              name="username"
              rules={{
                required: 'Username is required',
                validate: (value) => {
                  if (value.includes('@')) {
                    return validateInputs(value, 'email') || 'Invalid email';
                  } else if (value.includes('07')) {
                    return (
                      validateInputs(value, 'tel') || 'Invalid phone number'
                    );
                  }
                  return 'Invalid username';
                },
              }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      {...field}
                      label="Username"
                      required
                      placeholder="Enter your email or phone number"
                    />
                    {errors?.username && (
                      <InputErrorMessage message={errors?.username?.message} />
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="password"
              rules={{ required: 'Password is required' }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      {...field}
                      label="Password"
                      required
                      type="password"
                      placeholder="Enter your password"
                    />
                    {errors?.password && (
                      <InputErrorMessage message={errors?.password?.message} />
                    )}
                  </label>
                );
              }}
            />
            <menu className="w-full flex flex-col gap-4 my-2">
              <Input type="checkbox" label="Remember me" />
              <ul className="w-full flex flex-col gap-4">
                <Button submit primary>
                  {loginIsLoading ? <Loader /> : 'Login'}
                </Button>
                <Link
                  to="/auth/register"
                  className="text-center text-sm text-primary hover:underline"
                >
                  Don't have an account? Register
                </Link>
              </ul>
            </menu>
          </fieldset>
          <article className="w-full flex items-center justify-center">
            <Link
              to="/"
              className="text-center text-sm text-black hover:underline"
            >
              Go to homepage
            </Link>
          </article>
        </form>
      </main>
    </PublicLayout>
  );
};

export default Login;
