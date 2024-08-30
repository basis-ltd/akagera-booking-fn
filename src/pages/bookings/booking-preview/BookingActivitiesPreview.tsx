import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { bookingActivitiesColumns } from '@/constants/bookingActivity.constants';
import { calculateActivityPrice } from '@/helpers/booking.helper';
import { formatCurrency } from '@/helpers/strings.helper';
import { useLazyFetchBookingActivitiesQuery } from '@/states/apiSlice';
import {
  setBookingActivitiesList,
  setDeleteBookingActivityModal,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingActivitiesPreview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH BOOKING ACTIVITIES QUERY
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      error: bookingActivitiesError,
      isSuccess: bookingActivitiesIsSuccess,
      isError: bookingActivitiesIsError,
      isFetching: bookingActivitiesIsFetching,
    },
  ] = useLazyFetchBookingActivitiesQuery();

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    if (booking?.id) {
      fetchBookingActivities({ bookingId: booking?.id, size: 100 });
    }
  }, [fetchBookingActivities, booking]);

  // HANDLE FETCH BOOKING ACTIVITIES RESPONSE
  useEffect(() => {
    if (bookingActivitiesIsError) {
      if ((bookingActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking activities. Please try again later.'
        );
      } else {
        toast.error((bookingActivitiesError as ErrorResponse).data.message);
      }
    } else if (bookingActivitiesIsSuccess) {
      const formattedBookingActivities = bookingActivitiesData?.data?.rows.map(
        (bookingActivity: BookingActivity, index: number) => {
          return {
            ...bookingActivity,
            no: index + 1,
            activity: bookingActivity?.activity,
            price: bookingActivity?.defaultRate
              ? formatCurrency(
                  Number(bookingActivity?.defaultRate) *
                    Number(
                      bookingActivity?.numberOfSeats ||
                        bookingActivity?.numberOfAdults
                    )
                )
              : `${formatCurrency(calculateActivityPrice(bookingActivity))}`,
            numberOfPeople: bookingActivity?.bookingActivityPeople?.length,
            numberOfAdults: bookingActivity?.numberOfAdults || '',
            numberOfChildren: bookingActivity?.numberOfChildren || '',
          };
        }
      );
      dispatch(setBookingActivitiesList(formattedBookingActivities));
    }
  }, [
    bookingActivitiesIsSuccess,
    bookingActivitiesIsError,
    bookingActivitiesData,
    bookingActivitiesError,
    dispatch,
  ]);

  // BOOKING ACTIVITIES COLUMNS
  const bookingActivitiesExtendedColumns = [
    ...bookingActivitiesColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingActivity> }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingActivity(row?.original));
                dispatch(setDeleteBookingActivityModal(true));
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <section className='w-full flex flex-col gap-4'>
      {booking?.type !== 'registration' &&
        (bookingActivitiesIsFetching ? (
          <figure className="w-full flex flex-col gap-3 items-center justify-center min-h-[50vh]">
            <Loader className="text-primary" />
            <p className="text-primary">Loading booking activities...</p>
          </figure>
        ) : (
          bookingActivitiesIsSuccess && (
            <menu className="flex flex-col gap-2 w-full">
              <ul className="flex items-center gap-3 w-full justify-between my-2 px-1">
                <h1 className="font-bold text-xl uppercase">Activities</h1>
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
              {bookingActivitiesList?.length > 0 ? (
                <Table
                  showFilter={false}
                  showPagination={false}
                  columns={bookingActivitiesExtendedColumns}
                  data={bookingActivitiesList}
                />
              ) : (
                <article className="flex w-full flex-col items-center gap-4 my-6">
                  <p className="text-center text-primary font-medium">
                    No activities added to this booking. Click the button below
                    to add them now.
                  </p>
                  <Button primary route={`/bookings/${booking?.id}/create`}>
                    Add activities
                  </Button>
                </article>
              )}
            </menu>
          )
        ))}
    </section>
  );
};

export default BookingActivitiesPreview;
