import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Editor from '@/components/inputs/Editor';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import AdminLayout from '@/containers/AdminLayout';
import {
  useLazyGetTermsOfServiceQuery,
  useUpdateTermsOfServiceMutation,
} from '@/states/apiSlice';
import { useEffect, useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const TermsOfService = () => {
  // STATE VARIABLES
  const [termsOfService, setTermsOfService] = useState<string>('');
  const [editTermsOfService, setEditTermsOfService] = useState<boolean>(false);

  // REACT HOOK FORM
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // INITIALIZE FETCHING TERMS OF SERVICE
  const [
    fetchTermsOfService,
    {
      data: termsOfServiceData,
      error: termsOfServiceError,
      isFetching: termsOfServiceIsFetching,
      isError: termsOfServiceIsError,
      isSuccess: termsOfServiceIsSuccess,
    },
  ] = useLazyGetTermsOfServiceQuery();

  // FETCH TERMS OF SERVICE
  useEffect(() => {
    fetchTermsOfService({});
  }, [fetchTermsOfService]);

  // HANDLE TERMS OF SERVICE RESPONSE
  useEffect(() => {
    if (termsOfServiceIsError) {
      const errorResponse =
        (termsOfServiceError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching terms of service. Please try again.';
      toast.error(errorResponse);
    } else if (termsOfServiceIsSuccess) {
      setTermsOfService(termsOfServiceData?.data[0]?.termsOfService || '');
    }
  }, [
    termsOfServiceData?.data,
    termsOfServiceData?.data.content,
    termsOfServiceError,
    termsOfServiceIsError,
    termsOfServiceIsSuccess,
  ]);

  // INITIALIZE UPDATE TERMS OF SERVICE MUTATION
  const [
    updateTermsOfService,
    {
      isLoading: updateTermsOfServiceIsLoading,
      isSuccess: updateTermsOfServiceIsSuccess,
      data: updateTermsOfServiceData,
      error: updateTermsOfServiceError,
      isError: updateTermsOfServiceIsError,
      reset: resetUpdateTermsOfService,
    },
  ] = useUpdateTermsOfServiceMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    updateTermsOfService({
      id: termsOfServiceData?.data[0]?.id,
      termsOfService: data?.termsOfService,
    });
  };

  // HANDLE UPDATE TERMS OF SERVICE RESPONSE
  useEffect(() => {
    if (updateTermsOfServiceIsError) {
      const errorResponse =
        (updateTermsOfServiceError as ErrorResponse)?.data?.message ||
        'An error occurred while updating terms of service. Please try again.';
      toast.error(errorResponse);
    } else if (updateTermsOfServiceIsSuccess) {
      toast.success('Terms of service updated successfully');
      setEditTermsOfService(false);
      setTermsOfService(updateTermsOfServiceData?.data?.termsOfService || '');
      resetUpdateTermsOfService();
    }
  }, [
    fetchTermsOfService,
    resetUpdateTermsOfService,
    termsOfServiceData,
    updateTermsOfServiceData?.data?.termsOfService,
    updateTermsOfServiceError,
    updateTermsOfServiceIsError,
    updateTermsOfServiceIsSuccess,
  ]);

  // BREADCRUMB LINKS
  const breadcrumbLinks = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: `Terms of services`,
      route: `/dashboard/terms-of-services`,
    },
  ];

  // SET DEFAULT VALUE
  useEffect(() => {
    setValue('termsOfService', termsOfService);
  }, [setValue, termsOfService]);

  return (
    <AdminLayout>
      <main className="w-[85%] mx-auto flex flex-col">
        <nav className='w-full my-3'>
        <CustomBreadcrumb navigationLinks={breadcrumbLinks} />
        </nav>
        <section className="flex flex-col gap-4">
          {termsOfServiceIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[70vh]">
              <Loader className="text-primary" />
            </figure>
          ) : (
            <section className="w-full flex flex-col gap-4 my-4">
              {editTermsOfService ? (
                <form
                  className="w-full flex flex-col gap-4 h-[80vh]"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    name="termsOfService"
                    control={control}
                    defaultValue={termsOfService}
                    rules={{ required: 'Terms of service is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1 h-full">
                          <Editor
                            defaultValue={termsOfService}
                            height="70vh"
                            {...field}
                          />
                          {errors?.termsOfService && (
                            <InputErrorMessage
                              message={errors?.termsOfService?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                  <menu className="w-full flex items-center gap-3 justify-between">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setEditTermsOfService(false);
                      }}
                    >
                      Back
                    </Button>
                    <Button primary submit>
                      {updateTermsOfServiceIsLoading ? <Loader /> : 'Save'}
                    </Button>
                  </menu>
                </form>
              ) : (
                <article
                  className="w-full mx-auto"
                  dangerouslySetInnerHTML={{ __html: termsOfService }}
                />
              )}
            </section>
          )}
          {!editTermsOfService && (
            <menu className="flex items-center gap-3 justify-between mb-4">
              <Button route={'/dashboard'}>Cancel</Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setEditTermsOfService(true);
                }}
                primary
              >
                Edit
              </Button>
            </menu>
          )}
        </section>
      </main>
    </AdminLayout>
  );
};

export default TermsOfService;
