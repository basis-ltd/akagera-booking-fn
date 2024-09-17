import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import AdminLayout from '@/containers/AdminLayout';
import {
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
} from '@/states/apiSlice';
import { setUser } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [editProfile, setEditProfile] = useState(false);

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm();
  const { existingPassword, newPassword, confirmPassword } = watch();

  // INITIALIZE GET USER BY ID QUERY
  const [
    getUserById,
    {
      data: userData,
      isFetching: userIsFetching,
      isSuccess: userIsSuccess,
      isError: userIsError,
      error: userError,
    },
  ] = useLazyGetUserByIdQuery();

  // FETCH USER DATA
  useEffect(() => {
    getUserById({ id: user?.id });
  }, [getUserById, user?.id]);

  // HANDLE USER DATA
  useEffect(() => {
    if (userIsSuccess && userData) {
      dispatch(setUser(userData?.data));
    } else if (userIsError) {
      const errorResponse = (userError as ErrorResponse)?.data?.message;
      toast.error(
        errorResponse || 'Failed to fetch user data. Refresh and try again.'
      );
    }
  }, [userIsSuccess, userData, dispatch, userIsError, userError]);

  // INITIALIZE UPDATE USER MUTATION
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isSuccess: updateUserIsSuccess,
      isError: updateUserIsError,
      error: updateUserError,
    },
  ] = useUpdateUserMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateUser({
      id: user?.id,
      phone: data?.phone,
      name: data?.name,
      dateOfBirth: data?.dateOfBirth
        ? moment(data?.dateOfBirth).format('YYYY-MM-DD')
        : undefined,
      nationality: data?.nationality,
      residence: data?.residence,
      gender: data?.gender,
    });
  };

  // HANDLE UPDATE USER RESPONSE
  useEffect(() => {
    if (updateUserIsSuccess && updateUserData) {
      getUserById({ id: user?.id });
      setEditProfile(false);
      toast.success('User profile updated successfully');
    } else if (updateUserIsError) {
      const errorResponse = (updateUserError as ErrorResponse)?.data?.message;
      toast.error(
        errorResponse || 'Failed to update user profile. Refresh and try again.'
      );
    }
  }, [
    updateUserIsSuccess,
    updateUserData,
    dispatch,
    updateUserIsError,
    updateUserError,
    getUserById,
    user?.id,
  ]);

  // INITIALIZE UPDATE USER PASSWORD
  const [
    updateUserPassword,
    {
      data: updateUserPasswordData,
      isLoading: updateUserPasswordIsLoading,
      isSuccess: updateUserPasswordIsSuccess,
      isError: updateUserPasswordIsError,
      error: updateUserPasswordError,
    },
  ] = useUpdateUserPasswordMutation();

  // HANDLE UPDATE USER PASSWORD RESPONSE
  useEffect(() => {
    if (updateUserPasswordIsSuccess && updateUserPasswordData) {
      toast.success('User password updated successfully');
      setValue('existingPassword', '');
      setValue('newPassword', '');
      setValue('confirmPassword', '');
    } else if (updateUserPasswordIsError) {
      const errorResponse = (updateUserPasswordError as ErrorResponse)?.data
        ?.message;
      toast.error(
        errorResponse ||
          'Failed to update user password. Refresh and try again.'
      );
    }
  }, [
    updateUserPasswordIsSuccess,
    updateUserPasswordData,
    updateUserPasswordIsError,
    updateUserPasswordError,
    setValue,
  ]);

  return (
    <AdminLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-6 p-6">
        {userIsFetching ? (
          <figure className="h-[10vh] flex items-center justify-center">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <article className="w-full flex flex-col gap-5">
            <section className="w-full flex flex-col items-start gap-3 justify-between">
              <figure className="w-[100px] h-[100px] flex items-center justify-center gap-1 rounded-full">
                {user?.photo ? (
                  <img
                    src={user?.photo}
                    alt="User"
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="w-full h-full bg-gray-200 rounded-full cursor-pointer"></span>
                )}
              </figure>
              <Button primary className="!h-fit !w-fit">
                <menu className="flex items-center gap-2 text-[13px]">
                  Edit image
                  <FontAwesomeIcon icon={faFileUpload} />
                </menu>
              </Button>
            </section>
            <hr className="h-[.5px] border border-primary" />
            <section className="w-full flex flex-col gap-4">
              <h1 className="uppercase text-primary font-semibold text-lg">
                {user?.name}'s Profile
              </h1>
              <form
                className="w-full flex flex-col gap-3"
                onSubmit={handleSubmit(onSubmit)}
              >
                <fieldset className="grid grid-cols-2 gap-5 w-full">
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: 'Name is required' }}
                    defaultValue={user?.name}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            label="Name"
                            required={editProfile}
                            readOnly={!editProfile}
                          />
                          {errors?.name && (
                            <InputErrorMessage
                              message={errors?.name?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    defaultValue={user?.dateOfBirth}
                    rules={{ required: 'Date of birth is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            type="date"
                            label="Date of birth"
                            required={editProfile}
                            toDate={moment().subtract(18, 'years').toDate()}
                            readOnly={!editProfile}
                          />
                          {errors?.dateOfBirth && (
                            <InputErrorMessage
                              message={errors?.dateOfBirth?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="nationality"
                    control={control}
                    defaultValue={user?.nationality}
                    rules={{ required: 'Nationality is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Select
                            required={editProfile}
                            readOnly={!editProfile}
                            label="Nationality"
                            options={COUNTRIES?.map((country) => {
                              return {
                                label: country?.name,
                                value: country?.code,
                              };
                            })}
                            {...field}
                          />
                          {errors?.nationality && (
                            <InputErrorMessage
                              message={errors?.nationality?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="residence"
                    control={control}
                    defaultValue={user?.residence}
                    rules={{ required: 'Residence is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Select
                            required={editProfile}
                            readOnly={!editProfile}
                            label="Residence"
                            options={COUNTRIES?.map((country) => {
                              return {
                                label: country?.name,
                                value: country?.code,
                              };
                            })}
                            {...field}
                          />
                          {errors?.residence && (
                            <InputErrorMessage
                              message={errors?.residence?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue={user?.phone}
                    rules={{ required: 'Phone is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            label="Phone"
                            required={editProfile}
                            readOnly={!editProfile}
                          />
                          {errors?.phone && (
                            <InputErrorMessage
                              message={errors?.phone?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue={user?.gender}
                    rules={{ required: 'Gender is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Select
                            label="Sex"
                            options={genderOptions}
                            {...field}
                            required={editProfile}
                            readOnly={!editProfile}
                          />
                          {errors?.gender && (
                            <InputErrorMessage
                              message={errors?.gender?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                </fieldset>
                <menu className="w-full flex items-center gap-3 justify-between my-4">
                  <Button
                    primary={!editProfile}
                    className="!h-fit !w-fit"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditProfile(!editProfile);
                    }}
                  >
                    {editProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                  {editProfile && (
                    <Button
                      primary
                      className="!h-fit !w-fit"
                      type="submit"
                      submit
                    >
                      {updateUserIsLoading ? (
                        <Loader className="text-white" />
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  )}
                </menu>
              </form>
            </section>
            <hr className="h-[.5px] border border-primary" />
            <section className="w-full flex flex-col gap-4">
              <h1 className="uppercase text-primary font-semibold text-lg">
                Change Password
              </h1>
              <form className="w-full flex flex-col gap-3">
                <fieldset className="grid grid-cols-2 gap-5 w-full">
                  <Controller
                    name="existingPassword"
                    control={control}
                    rules={{
                      required: 'Old password is required',
                      validate: (value) => {
                        if (value === newPassword) {
                          return 'Old password cannot be the same as new password';
                        } else {
                          return true;
                        }
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            label="Old Password"
                            type="password"
                            required
                            onChange={(e) => {
                              field.onChange(e);
                              trigger('existingPassword');
                              trigger('newPassword');
                              trigger('confirmPassword');
                            }}
                          />
                          {errors?.existingPassword && (
                            <InputErrorMessage
                              message={errors?.existingPassword?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="newPassword"
                    control={control}
                    rules={{
                      required: 'New password is required',
                      validate: (value) => {
                        if (value === existingPassword) {
                          return 'New password cannot be the same as old password';
                        } else {
                          return true;
                        }
                      },
                    }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            label="New Password"
                            type="password"
                            required
                            onChange={(e) => {
                              field.onChange(e);
                              trigger('existingPassword');
                              trigger('newPassword');
                              trigger('confirmPassword');
                            }}
                          />
                          {errors?.newPassword && (
                            <InputErrorMessage
                              message={errors?.newPassword?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: 'Confirm password is required',
                      validate: (value) =>
                        value === newPassword || 'Passwords do not match',
                    }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            label="Confirm Password"
                            type="password"
                            required
                            onChange={(e) => {
                              field.onChange(e);
                              trigger('existingPassword');
                              trigger('newPassword');
                              trigger('confirmPassword');
                            }}
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
                <menu className="w-full flex items-center gap-3 justify-between my-4">
                  <Button
                    primary
                    disabled={
                      Object.keys(errors).length > 0 ||
                      !existingPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword ||
                      newPassword === existingPassword
                    }
                    className="!h-fit !w-fit"
                    onClick={(e) => {
                      e.preventDefault();
                      updateUserPassword({
                        id: user?.id,
                        existingPassword,
                        newPassword,
                      });
                    }}
                  >
                    {updateUserPasswordIsLoading ? (
                      <Loader className="text-white" />
                    ) : (
                      'Update Password'
                    )}
                  </Button>
                </menu>
              </form>
            </section>
          </article>
        )}
      </main>
    </AdminLayout>
  );
};

export default UserProfile;
