import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import Table from '@/components/table/Table';
import { COUNTRIES } from '@/constants/countries.constants';
import { capitalizeString } from '@/helpers/strings.helper';
import { useLazyFetchPopularBookingPeopleQuery } from '@/states/apiSlice';
import { AppDispatch } from '@/states/store';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PopularBookingPeople = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [criteria, setCriteria] = useState<string>('nationality');

  // REACT HOOK FORM
  const { control } = useForm();

  // NAVIGATION
    const navigate = useNavigate();

  // INITIALIZE FETCH POPULAR BOOKING PEOPLE
  const [
    fetchPopularBookingPeople,
    {
      data: popularBookingPeopleData,
      isFetching: popularBookingPeopleIsFetching,
      isSuccess: popularBookingPeopleIsSuccess,
      isError: popularBookingPeopleIsError,
      error: popularBookingPeopleError,
    },
  ] = useLazyFetchPopularBookingPeopleQuery();

  // FETCH POPULAR BOOKING PEOPLE
  useEffect(() => {
    fetchPopularBookingPeople({
      size: 10,
      page: 0,
      criteria,
    });
  }, [criteria, fetchPopularBookingPeople]);

  // HANDLE POPULAR BOOKING PEOPLE RESPONSE
  useEffect(() => {
    if (popularBookingPeopleIsError) {
      const errorResponse = (popularBookingPeopleError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || `Failed to fetch popular booking people`);
    }
  }, [
    dispatch,
    popularBookingPeopleData,
    popularBookingPeopleError,
    popularBookingPeopleIsError,
    popularBookingPeopleIsSuccess,
  ]);

  // POPULAR BOOKING PEOPLE COLUMNS
  const popularBookingPeopleColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: criteria === 'dateOfBirth' ? 'Age' : capitalizeString(criteria),
      accessorKey: 'name',
    },
    {
      header: 'Numbe of People',
      accessorKey: 'count',
    },
    {
        header: 'Actions',
        accessorKey: 'actions',
        cell: () => {
          return (
            <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="cursor-pointer text-primary hover:text-primary-dark transition-all duration-200 ease-in-out hover:translate-x-1 transform"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/dashboard/registrations`);
              }}
            />
          </menu>
          );
        },
    }
  ];

  return (
    <menu className="flex flex-col gap-4">
      <ul className="w-full flex items-center gap-3 justify-between">
        <h1 className="uppercase text-primary font-medium text-md">
          Most popular booking people
        </h1>{' '}
        <Controller
          name="criteria"
          defaultValue={criteria}
          control={control}
          render={({ field }) => {
            return (
              <label className="w-[40%]">
                <Select
                  {...field}
                  placeholder="Select criteria"
                  options={['nationality', 'residence', 'dateOfBirth']?.map(
                    (criteria) => {
                      return {
                        label:
                          criteria === 'dateOfBirth'
                            ? 'Age'
                            : capitalizeString(criteria),
                        value: criteria,
                      };
                    }
                  )}
                  onChange={(e) => {
                    field.onChange(e);
                    setCriteria(e);
                  }}
                />
              </label>
            );
          }}
        />
      </ul>
      {popularBookingPeopleIsFetching ? (
        <figure className="w-full flex items-center min-h-[20vh] justify-center">
          <Loader className="text-primary" />
        </figure>
      ) : (
        popularBookingPeopleIsSuccess && (
          <Table
            showFilter={false}
            columns={popularBookingPeopleColumns}
            data={popularBookingPeopleData?.data?.map(
              (
                bookingPerson: {
                  value: string;
                  count: number;
                },
                index: number
              ) => {
                return {
                  no: index + 1,
                  ...bookingPerson,
                  name: COUNTRIES?.find(
                    (country) => country?.code === bookingPerson?.value
                  )?.name,
                  count: bookingPerson?.count,
                };
              }
            )}
          />
        )
      )}
    </menu>
  );
};

export default PopularBookingPeople;
