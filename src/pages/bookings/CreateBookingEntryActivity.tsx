import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import Button from '@/components/inputs/Button';
import Select from '@/components/inputs/Select';
import {
  accommodationOptions,
  exitGateOptions,
} from '@/constants/bookings.constants';
import {
  setBookingPeopleList,
  setCreateBookingPersonModal,
} from '@/states/features/bookingPeopleSlice';
import { setSelectedService } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import CreateBookingPerson from './CreateBookingPerson';
import Table from '@/components/table/Table';
import { genderOptions } from '@/constants/inputs.constants';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { COUNTRIES } from '@/constants/countries.constants';
import {
  useLazyFetchBookingPeopleQuery,
  useLazyFetchBookingVehiclesQuery,
} from '@/states/apiSlice';
import { useEffect } from 'react';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '@/components/inputs/Loader';
import moment from 'moment';
import {
  setBookingVehiclesList,
  setCreateBookingVehicleModal,
} from '@/states/features/bookingVehicleSlice';
import CreateBookingVehicle from './CreateBookingVehicle';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import { vehicleTypes } from '@/constants/vehicles';

const CreateBookingEntryActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { servicesList, selectedService } = useSelector(
    (state: RootState) => state.service
  );
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingVehiclesList } = useSelector(
    (state: RootState) => state.bookingVehicle
  );

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm();

  // INITIALIZE FETCH BOOKING PEOPLE QUERY
  const [
    fetchBookingPeople,
    {
      data: fetchBookingPeopleData,
      error: fetchBookingPeopleError,
      isLoading: fetchBookingPeopleIsLoading,
      isSuccess: fetchBookingPeopleIsSuccess,
      isError: fetchBookingPeopleIsError,
    },
  ] = useLazyFetchBookingPeopleQuery();

  // FETCH BOOKING PEOPLE
  useEffect(() => {
    fetchBookingPeople({ bookingId: booking?.id, take: 100, skip: 0 });
  }, [booking?.id, fetchBookingPeople, selectedService]);

  // HANDLE FETCH BOOKING PEOPLE RESPONSE
  useEffect(() => {
    if (fetchBookingPeopleIsError) {
      if ((fetchBookingPeopleError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching booking people. Please try again later'
        );
      } else {
        toast.error((fetchBookingPeopleError as ErrorResponse)?.data?.message);
      }
    } else if (fetchBookingPeopleIsSuccess) {
      dispatch(setBookingPeopleList(fetchBookingPeopleData?.data?.rows));
    }
  }, [
    fetchBookingPeopleIsSuccess,
    fetchBookingPeopleData,
    dispatch,
    fetchBookingPeopleIsError,
    fetchBookingPeopleError,
  ]);

  // INITIALIZE FETCH BOOKING VEHICLES QUERY
  const [
    fetchBookingVehicles,
    {
      data: fetchBookingVehiclesData,
      error: fetchBookingVehiclesError,
      isLoading: fetchBookingVehiclesIsLoading,
      isSuccess: fetchBookingVehiclesIsSuccess,
      isError: fetchBookingVehiclesIsError,
    },
  ] = useLazyFetchBookingVehiclesQuery();

  // FETCH BOOKING VEHICLES
  useEffect(() => {
    fetchBookingVehicles({ bookingId: booking?.id });
  }, [booking?.id, fetchBookingVehicles, selectedService]);

  // HANDLE FETCH BOOKING VEHICLES RESPONSE
  useEffect(() => {
    if (fetchBookingVehiclesIsError) {
      if ((fetchBookingVehiclesError as ErrorResponse)?.status === 500) {
        toast.error(
          'An error occurred while fetching booking vehicles. Please try again later'
        );
      } else {
        toast.error(
          (fetchBookingVehiclesError as ErrorResponse)?.data?.message
        );
      }
    } else if (fetchBookingVehiclesIsSuccess) {
      dispatch(setBookingVehiclesList(fetchBookingVehiclesData?.data?.rows));
    }
  }, [
    fetchBookingVehiclesIsSuccess,
    fetchBookingVehiclesData,
    dispatch,
    fetchBookingVehiclesIsError,
    fetchBookingVehiclesError,
  ]);

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    return data;
  };

  // BOOKING PEOPLE COLUMNS
  const bookingPeopleColumns = [
    {
      header: 'Full Names',
      accessorKey: 'name',
    },
    {
      header: 'Age',
      accessorKey: 'age',
    },
    {
      header: 'Nationality',
      accessorKey: 'nationality',
    },
    {
      header: 'Residence',
      accessorKey: 'residence',
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
  ];

  // BOOKING VEHICLES COLUMNS
  const bookingVehiclesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Vehicle Type',
      accessorKey: 'vehicleType',
    },
    {
      header: 'Registration Country',
      accessorKey: 'registrationCountry',
    },
    {
      header: 'Plate Number',
      accessorKey: 'plateNumber',
    },
  ];

  return (
    <section className="w-full flex flex-col gap-3 pb-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <menu className="grid grid-cols-2 gap-5">
          <Controller
            name="exitGate"
            rules={{ required: 'Number of people is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    {...field}
                    label="Select exit gate"
                    placeholder="Select exit gate"
                    required
                    options={exitGateOptions}
                    onChange={(e) => {
                      field.onChange(e);
                      trigger(field.name);
                    }}
                  />
                  {errors?.exitGate && (
                    <InputErrorMessage message={errors.exitGate.message} />
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="accomodation"
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-1 w-full">
                  <Select
                    options={accommodationOptions}
                    {...field}
                    label="Select place of accomodation"
                    onChange={(e) => {
                      field.onChange(e);
                      trigger(field.name);
                    }}
                    placeholder="Select accomodation"
                  />
                </label>
              );
            }}
          />
        </menu>
        <section className="flex flex-col gap-6 mt-4">
          {/**
           * BOOKING PEOPLE DETAILS
           */}
          <menu className="w-full flex flex-col gap-3 min-h-[10vh]">
            <ul className="flex items-center gap-3 justify-between">
              <h3 className="text-primary uppercase text-lg font-bold">
                Booking people
              </h3>
              <Button
                primary
                className="!py-1"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setCreateBookingPersonModal(true));
                }}
              >
                <ul className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  <p className="text-[13px]">
                    {' '}
                    Add{' '}
                    {bookingPeopleList?.length <= 0 ? `person` : 'new person'}
                  </p>
                </ul>
              </Button>
            </ul>
            {fetchBookingPeopleIsLoading && (
              <figure className="min-h-[40vh] flex items-center justify-center">
                <Loader />
              </figure>
            )}
            {bookingPeopleList?.length > 0 && (
              <Table
                data={bookingPeopleList?.map((bookingPerson: BookingPerson) => {
                  return {
                    ...bookingPerson,
                    gender: genderOptions?.find(
                      (gender) => gender.value === bookingPerson?.gender
                    )?.label,
                    nationality: COUNTRIES?.find(
                      (country) => country.code === bookingPerson?.nationality
                    )?.name,
                    residence: COUNTRIES?.find(
                      (country) => country.code === bookingPerson?.residence
                    )?.name,
                    age: moment().diff(
                      bookingPerson?.dateOfBirth,
                      'years',
                      false
                    ),
                  };
                })}
                columns={bookingPeopleColumns}
              />
            )}
          </menu>
          {/**
           * BOOKING VEHICLES DETAILS
           */}
          <menu className="w-full flex flex-col gap-3 min-h-[10vh]">
            <ul className="flex items-center gap-3 justify-between">
              <h3 className="text-primary uppercase text-lg font-bold">
                Booking vehicles
              </h3>
              <Button
                primary
                className="!py-1"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setCreateBookingVehicleModal(true));
                }}
              >
                <ul className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faPlus} />
                  <p className="text-[13px]">
                    {' '}
                    Add{' '}
                    {bookingVehiclesList?.length <= 0
                      ? `vehicle`
                      : 'new vehicle'}
                  </p>
                </ul>
              </Button>
            </ul>
            {fetchBookingVehiclesIsLoading && (
              <figure className="min-h-[40vh] flex items-center justify-center">
                <Loader />
              </figure>
            )}
            {fetchBookingVehiclesIsSuccess &&
              bookingVehiclesList?.length > 0 && (
                <Table
                  columns={bookingVehiclesColumns}
                  data={bookingVehiclesList?.map(
                    (bookingVehicle: BookingVehicle, index: number) => {
                      return {
                        ...bookingVehicle,
                        no: index + 1,
                        vehicleType: vehicleTypes?.find(
                          (vehicle) =>
                            vehicle?.value === bookingVehicle?.vehicleType
                        )?.label,
                        registrationCountry: COUNTRIES?.find(
                          (country) =>
                            country?.code ===
                            bookingVehicle?.registrationCountry
                        )?.name,
                      };
                    }
                  )}
                />
              )}
          </menu>
        </section>
        <menu className="flex items-center gap-3 justify-between w-full">
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setSelectedService(
                  servicesList.indexOf(selectedService) - 1 >= 0 &&
                    servicesList[servicesList.indexOf(selectedService) - 1]
                )
              );
            }}
            disabled={servicesList.indexOf(selectedService) - 1 < 0}
          >
            Back
          </Button>
          <Button
            primary
            disabled={
              servicesList.indexOf(selectedService) + 1 >= servicesList.length
            }
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                setSelectedService(
                  servicesList.indexOf(selectedService) + 1 <
                    servicesList.length &&
                    servicesList[servicesList.indexOf(selectedService) + 1]
                )
              );
            }}
          >
            Next
          </Button>
        </menu>
      </form>
      <CreateBookingPerson />
      <CreateBookingVehicle />
    </section>
  );
};

export default CreateBookingEntryActivity;
