import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Modal from '@/components/modals/Modal';
import { COUNTRIES } from '@/constants/countries.constants';
import { userRoles } from '@/constants/user.constants';
import validateInputs from '@/helpers/validations.helper';
import { useCreateUserMutation } from '@/states/apiSlice';
import { addUserToList, setCreateUserModal } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateUser = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { createUserModal } = useSelector((state: RootState) => state.user);

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  // INITIALIZE CREATE USER MUTATION
  const [
    createUser,
    {
      data: createUserData,
      isLoading: createUserIsLoading,
      isSuccess: createUserIsSuccess,
      isError: createUserIsError,
      error: createUserError,
    },
  ] = useCreateUserMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createUser({
      email: data?.email,
      nationality: data?.nationality,
      role: data?.role,
      name: data?.name,
    });
  };

  // HANDLE CREATE USER RESPONSE
  useEffect(() => {
    if (createUserIsError) {
      if ((createUserError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while creating user. Refresh and try again'
        );
      } else {
        toast.error((createUserError as ErrorResponse)?.data?.message);
      }
    } else if (createUserIsSuccess) {
      dispatch(addUserToList(createUserData?.data));
      toast.success(`${createUserData?.data?.name} added successfully`);
      reset({
        name: '',
        email: '',
        role: 'receptionist',
        nationality: 'RW',
      });
      dispatch(setCreateUserModal(false));
    }
  }, [
    createUserData?.data,
    createUserError,
    createUserIsError,
    createUserIsSuccess,
    dispatch,
    reset,
  ]);

  return (
    <Modal
      isOpen={createUserModal}
      onClose={() => {
        reset({
          name: '',
          email: '',
          role: 'receptionist',
          nationality: 'RW',
        });
        dispatch(setCreateUserModal(false));
      }}
      heading="Add new user"
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-2 gap-4 w-full">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Input
                    {...field}
                    label="Name"
                    placeholder="Ente full name"
                    required
                  />
                  {errors?.name && (
                    <InputErrorMessage message={errors?.name?.message} />
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
                <label className="w-full flex flex-col gap-1">
                  <Input
                    placeholder="Enter email address"
                    {...field}
                    label="Email address"
                    required
                  />
                  {errors?.email && (
                    <InputErrorMessage message={errors?.email?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="role"
            control={control}
            defaultValue={'receptionist'}
            rules={{ required: 'Select user role' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    options={userRoles}
                    required
                    label="Role"
                    {...field}
                  />
                  {errors?.role && (
                    <InputErrorMessage message={errors?.role?.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="nationality"
            control={control}
            defaultValue={'RW'}
            rules={{ required: 'Select user nationality' }}
            render={({ field }) => {
              return (
                <label className="w-full flex flex-col gap-1">
                  <Select
                    options={COUNTRIES?.map((country) => {
                      return {
                        value: country.code,
                        label: country.name,
                      };
                    })}
                    required
                    label="Nationality"
                    {...field}
                  />
                  {errors?.nationality && (
                    <InputErrorMessage message={errors?.nationality?.message} />
                  )}
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              reset({
                name: '',
                email: '',
                role: 'receptionist',
                nationality: 'RW',
              });
              dispatch(setCreateUserModal(false));
            }}
          >
            Cancel
          </Button>
          <Button primary submit>
            {createUserIsLoading ? <Loader /> : 'Submit'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default CreateUser;
