import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { bookingPeopleColumns } from '@/constants/bookingPerson.constants';
import { COUNTRIES } from '@/constants/countries.constants';
import { genderOptions } from '@/constants/inputs.constants';
import { calculateBookingPersonPrice } from '@/helpers/booking.helper';
import { formatCurrency } from '@/helpers/strings.helper';
import { useLazyFetchBookingPeopleQuery } from '@/states/apiSlice';
import {
  setBookingPeopleList,
  setDeleteBookingPersonModal,
  setSelectedBookingPerson,
} from '@/states/features/bookingPeopleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingPerson } from '@/types/models/bookingPerson.types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingPeoplePreview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingPeopleList } = useSelector(
    (state: RootState) => state.bookingPeople
  );

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH BOOKING PEOPLE QUERY
  const [
    fetchBookingPeople,
    {
      data: bookingPeopleData,
      error: bookingPeopleError,
      isSuccess: bookingPeopleIsSuccess,
      isError: bookingPeopleIsError,
      isFetching: bookingPeopleIsFetching,
    },
  ] = useLazyFetchBookingPeopleQuery();

  // FETCH BOOKING PEOPLE
  useEffect(() => {
    if (booking?.id) {
      fetchBookingPeople({ bookingId: booking?.id, size: 100 });
    }
  }, [fetchBookingPeople, booking]);

  // HANDLE FETCH BOOKING PEOPLE RESPONSE
  useEffect(() => {
    if (bookingPeopleIsError) {
      if ((bookingPeopleError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking people. Please try again later.'
        );
      } else {
        toast.error((bookingPeopleError as ErrorResponse)?.data?.message);
      }
    } else if (bookingPeopleIsSuccess) {
      dispatch(setBookingPeopleList(bookingPeopleData?.data?.rows));
    }
  }, [
    bookingPeopleIsSuccess,
    bookingPeopleIsError,
    bookingPeopleData,
    bookingPeopleError,
    dispatch,
  ]);

  // BOOKING PEOPLE COLUMNS
  const bookingPeopleExtendedColumns = [
    ...bookingPeopleColumns,
    {
      header: 'Entry fee',
      accessorKey: 'price',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingPerson> }) => {
        return (
          <menu className="flex items-center gap-3">
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

  return (
    <section className='w-full flex flex-col gap-4'>
      {bookingPeopleIsFetching ? (
        <figure className="w-full gap-4 flex items-center justify-center min-h-[50vh]">
          <Loader className="text-primary" />
          <p className="text-primary">Loading entry fees</p>
        </figure>
      ) : (
        bookingPeopleIsSuccess && (
          <menu className="flex flex-col gap-2 w-full">
            <ul className="flex items-center gap-3 w-full justify-between my-2 px-1">
              <h1 className="font-bold text-xl uppercase">Entry fees</h1>
              <Button
                className="!py-[2px] underline !text-[14px]"
                styled={false}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/bookings/${booking?.id}/create`);
                }}
              >
                Update
              </Button>
            </ul>
            <Table
              showFilter={false}
              showPagination={false}
              columns={
                bookingPeopleExtendedColumns as ColumnDef<BookingPerson>[]
              }
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
                  price: `${formatCurrency(
                    calculateBookingPersonPrice(bookingPerson)
                  )}`,
                };
              })}
            />
          </menu>
        )
      )}
    </section>
  );
};

export default BookingPeoplePreview;
