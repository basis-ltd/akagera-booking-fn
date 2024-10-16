import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import { bookingStatus } from '@/constants/bookings.constants';
import PublicLayout from '@/containers/PublicLayout';
import {
  getBookingStatusColor,
  handleDownloadBookingConsent,
} from '@/helpers/booking.helper';
import { capitalizeString, formatDate } from '@/helpers/strings.helper';
import { useLazySearchBookingsQuery } from '@/states/apiSlice';
import { setDraftBookingsList } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Booking } from '@/types/models/booking.types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import queryString, { ParsedQuery } from 'query-string';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ErrorResponse,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchBookings = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { draftBookingsList } = useSelector(
    (state: RootState) => state.booking
  );
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [consentIsFetching, setConsentIsFetching] = useState<boolean>(false);

  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );

  // NAVIGATION
  const navigate = useNavigate();
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  const { email, phone, referenceId, token } = queryParams;

  // INITIALIZE FETCH BOOKINGS QUERY
  const [
    searchBookings,
    {
      data: bookingsData,
      error: bookingsError,
      isFetching: bookingsIsFetching,
      isSuccess: bookingsIsSuccess,
      isError: bookingsIsError,
    },
  ] = useLazySearchBookingsQuery();

  // SEARCH BOOKINGS
  useEffect(() => {
    if (token) {
      searchBookings({
        email,
        phone,
        referenceId,
        token,
        page: 0,
        size: 100,
      });
    }
  }, [email, phone, referenceId, searchBookings, token]);

  // HANDLE FETCH BOOKINGS RESPONSE
  useEffect(() => {
    if (bookingsIsError) {
      if ((bookingsError as ErrorResponse).status === 401) {
        toast.error('Unauthorized access');
        navigate('/');
      } else {
        const errorResponse =
          (bookingsError as ErrorResponse)?.data?.message ||
          'An error occurred while searching bookings. Please try again';
        toast.error(errorResponse);
      }
    }
    if (bookingsIsSuccess) {
      if (bookingsData?.data?.rows?.length === 0) {
        toast.info('No bookings found');
      } else {
        dispatch(setDraftBookingsList(bookingsData?.data?.rows));
      }
    }
  }, [
    bookingsIsError,
    bookingsIsSuccess,
    bookingsData,
    bookingsError,
    dispatch,
    navigate,
  ]);

  // DRAFT BOOKINGS COLUMNS
  const draftBookingsColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Reference ID',
      accessorKey: 'referenceId',
    },
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Added by',
      accessorKey: 'email',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<Booking> }) => (
        <p
          className={`${getBookingStatusColor(
            row?.original?.status
          )} text-[14px] p-1 rounded-md text-center`}
        >
          {capitalizeString(row?.original?.status)}
        </p>
      ),
    },
    {
      header: 'Booking date',
      accessorKey: 'startDate',
      cell: ({ row }: { row: Row<Booking> }) =>
        formatDate(row.original.startDate),
    },
    {
      header: 'Date added',
      accessorKey: 'createdAt',
      cell: ({ row }: { row: Row<Booking> }) =>
        formatDate(row.original.createdAt),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }: { row: Row<Booking> }) => {
        return (
          <menu className="flex items-center gap-2">
            {Object.values(bookingStatus)
              ?.filter(
                (status) =>
                  ![
                    'approved',
                    'payment_received',
                    'confirmed',
                    'declined',
                  ].includes(status)
              )
              ?.includes(row?.original?.status) && (
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/bookings/${row.original.id}/preview`);
                }}
                className="text-[13px] p-2 rounded-md bg-primary text-white transition-all hover:scale-[1.01]"
              >
                Update
              </Link>
            )}
            {Object.values(bookingStatus)
              ?.filter((status) =>
                ['approved', 'payment_received', 'confirmed'].includes(status)
              )
              ?.includes(row?.original?.status) && (
              <Link
                to={'#'}
                onClick={async (e) => {
                  e.preventDefault();
                  setSelectedBooking(row.original);
                  setConsentIsFetching(true);
                  await handleDownloadBookingConsent({
                    booking: row?.original,
                  });
                  setConsentIsFetching(false);
                }}
                className="text-[13px] p-2 rounded-md bg-primary text-white transition-all hover:scale-[1.01] flex items-center gap-1"
              >
                <FontAwesomeIcon className="text-[13px]" icon={faDownload} />
                {consentIsFetching &&
                selectedBooking?.id === row?.original?.id ? (
                  <Loader />
                ) : (
                  'Consent'
                )}
              </Link>
            )}
          </menu>
        );
      },
    },
  ];

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      route: '/',
      label: 'Home',
    },
    {
      route: `/bookings/search?token=${token}&${
        email || phone || referenceId
      }=${email || phone || referenceId}`,
      label: 'Search',
    },
  ];

  return (
    <PublicLayout>
      <main className="flex flex-col gap-4 p-6 w-[90%] mx-auto">
        <CustomBreadcrumb navigationLinks={navigationLinks} />
        {bookingsIsFetching ? (
          <figure className="w-full flex items-center gap-2 justify-center min-h-[30vh]">
            <Loader className="text-primary" />{' '}
            <p className="text-[13px] text-primary">
              Searching bookings and registrations...
            </p>
          </figure>
        ) : (
          bookingsIsSuccess &&
          draftBookingsList?.length > 0 && (
            <section className="flex w-full flex-col gap-5">
              <h3 className="text-primary text-lg font-semibold uppercase">
                Search results for {email || phone || referenceId}
              </h3>
              <Table
                columns={draftBookingsColumns as ColumnDef<Booking>[]}
                data={draftBookingsList.map(
                  (booking: Booking, index: number) => {
                    return {
                      ...booking,
                      no: index + 1,
                      type: capitalizeString(booking.type),
                    };
                  }
                )}
              />
            </section>
          )
        )}
      </main>
    </PublicLayout>
  );
};

export default SearchBookings;
