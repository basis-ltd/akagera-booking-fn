import Button from '@/components/inputs/Button';
import {
  setBookingPeopleList,
  setCreateBookingPersonModal,
  setDeleteBookingPersonModal,
  setSelectedBookingPerson,
} from '@/states/features/bookingPeopleSlice';
import { setSelectedService } from '@/states/features/serviceSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
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
  setDeleteBookingVehicleModal,
  setSelectedBookingVehicle,
} from '@/states/features/bookingVehicleSlice';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import { vehicleTypes } from '@/constants/vehicles';
import { ColumnDef, Row } from '@tanstack/react-table';

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

  // INITIALIZE FETCH BOOKING PEOPLE QUERY
  const [
    fetchBookingPeople,
    {
      data: fetchBookingPeopleData,
      error: fetchBookingPeopleError,
      isFetching: fetchBookingPeopleIsFetching,
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
      isFetching: fetchBookingVehiclesIsFetching,
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
    {
      header: 'Number of days',
      accessorKey: 'numberOfDays',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingPerson> }) => {
        return (
          <menu className="flex items-center gap-3">
            {/* <FontAwesomeIcon
              icon={faPenToSquare}
              className="p-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full bg-primary text-white"
            /> */}
            <FontAwesomeIcon
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingPerson(row?.original));
                dispatch(setDeleteBookingPersonModal(true));
              }}
              className="bg-red-600 text-white p-2 px-[8.2px] transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full"
            />
          </menu>
        );
      },
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
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingVehicle> }) => {
        return (
          <menu className="flex items-center gap-3">
            {/* <FontAwesomeIcon
              icon={faPenToSquare}
              className="p-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full bg-primary text-white"
            /> */}
            <FontAwesomeIcon
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingVehicle(row?.original));
                dispatch(setDeleteBookingVehicleModal(true));
              }}
              className="bg-red-600 text-white p-2 px-[8.2px] transition-all duration-300 hover:scale-[1.01] cursor-pointer rounded-full"
            />
          </menu>
        );
      },
    },
  ];

  return (
    <section className="w-full flex flex-col gap-3 pb-6">
      <form className="flex flex-col gap-4">
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
            {fetchBookingPeopleIsFetching && (
              <figure className="min-h-[10vh] flex items-center justify-center">
                <Loader className="text-primary" />
              </figure>
            )}
            {bookingPeopleList?.length > 0 ? (
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
                    age: Number(
                      moment().diff(bookingPerson?.dateOfBirth, 'years', false)
                    ),
                    numberOfDays: Number(
                      moment(bookingPerson?.endDate).diff(
                        bookingPerson?.startDate,
                        'days'
                      )
                    ),
                  };
                })}
                columns={bookingPeopleColumns as ColumnDef<BookingPerson>[]}
              />
            ) : (
              fetchBookingPeopleIsSuccess && (
                <figure className="min-h-[10vh] flex items-center justify-center">
                  <p className="text-black text-[14px]">
                    You have not yet added people to your booking.
                  </p>
                </figure>
              )
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
            {fetchBookingVehiclesIsFetching && (
              <figure className="min-h-[10vh] flex items-center justify-center">
                <Loader className="text-primary" />
              </figure>
            )}
            {fetchBookingVehiclesIsSuccess &&
            bookingVehiclesList?.length > 0 ? (
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
                          country?.code === bookingVehicle?.registrationCountry
                      )?.name,
                    };
                  }
                )}
              />
            ) : (
              fetchBookingVehiclesIsSuccess && (
                <figure className="min-h-[5vh] flex items-center justify-center">
                  <p className="text-black text-[14px]">
                    You have not yet added vehicles to your booking.
                  </p>
                </figure>
              )
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
    </section>
  );
};

export default CreateBookingEntryActivity;
