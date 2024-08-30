import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { bookingVehicleColumns } from '@/constants/bookingVehicle.constants';
import { COUNTRIES } from '@/constants/countries.constants';
import { vehicleTypes } from '@/constants/vehicles.constants';
import { calculateVehiclePrice } from '@/helpers/booking.helper';
import { formatCurrency } from '@/helpers/strings.helper';
import { useLazyFetchBookingVehiclesQuery } from '@/states/apiSlice';
import {
  setBookingVehiclesList,
  setDeleteBookingVehicleModal,
  setSelectedBookingVehicle,
} from '@/states/features/bookingVehicleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { BookingVehicle } from '@/types/models/bookingVehicle.types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const BookingVehiclesPreview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { booking } = useSelector((state: RootState) => state.booking);
  const { bookingVehiclesList } = useSelector((state: RootState) => state.bookingVehicle);

  // NAVIGATE
  const navigate = useNavigate();

  // INITIALIZE FETCH BOOKING VEHICLES QUERY
  const [
    fetchBookingVehicles,
    {
      data: bookingVehiclesData,
      error: bookingVehiclesError,
      isSuccess: bookingVehiclesIsSuccess,
      isError: bookingVehiclesIsError,
      isFetching: bookingVehiclesIsFetching,
    },
  ] = useLazyFetchBookingVehiclesQuery();

  // FETCH BOOKING VEHICLES
  useEffect(() => {
    if (booking?.id) {
      fetchBookingVehicles({ bookingId: booking?.id, size: 100 });
    }
  }, [fetchBookingVehicles, booking]);

  // HANDLE FETCH BOOKING VEHICLES RESPONSE
  useEffect(() => {
    if (bookingVehiclesIsError) {
      if ((bookingVehiclesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking vehicles. Please try again later.'
        );
      } else {
        toast.error((bookingVehiclesError as ErrorResponse).data.message);
      }
    } else if (bookingVehiclesIsSuccess) {
      dispatch(setBookingVehiclesList(bookingVehiclesData?.data?.rows));
    }
  }, [
    bookingVehiclesIsSuccess,
    bookingVehiclesIsError,
    bookingVehiclesData,
    bookingVehiclesError,
    dispatch,
  ]);


  // BOOKING VEHICLES COLUMNS
  const bookingVehicleExtendedColumns = [
    ...bookingVehicleColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingVehicle> }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingVehicle(row?.original));
                dispatch(setDeleteBookingVehicleModal(true));
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
    <section className="w-full flex flex-col gap-4">
      {bookingVehiclesIsFetching ? (
        <figure className="w-full gap-3 flex-col flex items-center justify-center min-h-[50vh]">
          <Loader className="text-primary" />
          <p className="text-primary">Loading booking vehicles...</p>
        </figure>
      ) : (
        bookingVehiclesIsSuccess && (
          <menu className="flex flex-col gap-2 w-full">
            <ul className="flex items-center gap-6 my-2">
              <h1 className="font-bold text-xl uppercase">Vehicles</h1>
              <Button
                className="!py-[2px] underline !text-[12px]"
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
                bookingVehicleExtendedColumns as ColumnDef<BookingVehicle>[]
              }
              data={bookingVehiclesList?.map((bookingVehicle, index) => {
                return {
                  ...bookingVehicle,
                  no: index + 1,
                  vehicleType: vehicleTypes.find(
                    (vehicleType) =>
                      vehicleType?.value === bookingVehicle?.vehicleType
                  )?.label,
                  registrationCountry: COUNTRIES.find(
                    (country) =>
                      country?.code === bookingVehicle?.registrationCountry
                  )?.name,
                  vehiclePrice: `${formatCurrency(
                    calculateVehiclePrice(bookingVehicle)
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

export default BookingVehiclesPreview;
