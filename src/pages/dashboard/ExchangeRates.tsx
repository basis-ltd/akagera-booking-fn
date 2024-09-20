import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import AdminLayout from '@/containers/AdminLayout';
import {
  useLazyGetUsdRateQuery,
  useSetUsdRateMutation,
} from '@/states/apiSlice';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const ExchangeRates = () => {
  // NAVIGATION LINKS
  const navigationLinks = [
    {
      label: 'Dashboard',
      route: `/dashboard`,
    },
    {
      label: 'Exchange rates',
      route: `/dashboard/exchange-rates`,
    },
  ];
  // REACT HOOK FORM
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // INITIALIZE GET USD RATE QUERY
  const [
    getUsdRate,
    {
      data: usdRateData,
      error: usdRateError,
      isFetching: usdRateIsFetching,
      isSuccess: usdRateIsSuccess,
      isError: usdRateIsError,
    },
  ] = useLazyGetUsdRateQuery();

  // FETCH USD RATE
  useEffect(() => {
    getUsdRate({});
  }, [getUsdRate]);

  // HANDLE USD RATE RESPONSE
  useEffect(() => {
    if (usdRateIsError) {
      const errorResponse =
        (usdRateError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching USD rate. Please refresh the page.';
      toast.error(errorResponse);
    }
  }, [usdRateIsError, usdRateError]);

  // INITIALIZE SET USD RATE MUTATION
  const [
    setUsdRate,
    {
      data: setUsdRateData,
      error: setUsdRateError,
      isLoading: setUsdRateIsLoading,
      isSuccess: setUsdRateIsSuccess,
      isError: setUsdRateIsError,
    },
  ] = useSetUsdRateMutation();

  // HANDLE SET USD RATE RESPONSE
  useEffect(() => {
    if (setUsdRateIsError) {
      const errorResponse =
        (setUsdRateError as ErrorResponse)?.data?.message ||
        'An error occurred while updating USD rate. Please try again.';
      toast.error(errorResponse);
    }
    if (setUsdRateIsSuccess) {
      toast.success('USD rate updated successfully.');
      setValue('usdRate', setUsdRateData?.data?.usdRate);
    }
  }, [
    setUsdRateIsError,
    setUsdRateError,
    setUsdRateIsSuccess,
    setUsdRateData,
    setValue,
  ]);

  // SET DEFAULT VALUES
  useEffect(() => {
    if (usdRateIsSuccess && usdRateData) {
      setValue('usdRate', usdRateData?.data?.usdRate);
    }
  }, [usdRateIsSuccess, usdRateData, setValue]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    setUsdRate({ usdRate: data?.usdRate });
  };

  return (
    <AdminLayout>
      <main className="w-full sm:w-[95%] h-full sm:h-[90vh] mx-auto p-4 sm:p-6 flex flex-col gap-4">
        <nav className="w-full flex items-center justify-center">
          <CustomBreadcrumb navigationLinks={navigationLinks} />
        </nav>
        <section className="w-full h-full items-center justify-center flex flex-col gap-4">
          <menu className="shadow-xl py-8 sm:py-12 w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto rounded-md p-4 sm:p-8 flex flex-col gap-5">
            <h3 className="uppercase text-primary font-semibold text-lg text-center">
              Update exchange rates
            </h3>

            {usdRateIsFetching ? (
              <figure className="w-full flex items-center justify-center min-h-[20vh]">
                <Loader className="text-primary" />
              </figure>
            ) : (
              <form
                className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] xl:w-[35vw] mx-auto flex flex-col gap-3"
                onSubmit={handleSubmit(onSubmit)}
              >
                <fieldset className="w-full grid grid-cols-1 gap-5">
                  <Controller
                    name="usdRate"
                    control={control}
                    rules={{ required: 'USD Rate is required' }}
                    render={({ field }) => {
                      return (
                        <label className="w-full flex flex-col gap-1">
                          <Input
                            {...field}
                            placeholder="Enter USD Rate"
                            required
                            type="number"
                            label="USD Rate"
                          />
                          {errors.usdRate && (
                            <InputErrorMessage
                              message={errors?.usdRate?.message}
                            />
                          )}
                        </label>
                      );
                    }}
                  />
                </fieldset>
                <Button primary submit className="w-full">
                  {setUsdRateIsLoading ? <Loader /> : 'Update'}
                </Button>
              </form>
            )}
          </menu>
        </section>
      </main>
    </AdminLayout>
  );
};

export default ExchangeRates;
