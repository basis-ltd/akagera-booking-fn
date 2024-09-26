import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import Table from '@/components/table/Table';
import { bookingActivitiesColumns } from '@/constants/bookingActivity.constants';
import { formatDate } from '@/helpers/strings.helper';
import { useLazyFetchBookingActivitiesQuery } from '@/states/apiSlice';
import { setRemainingSeats } from '@/states/features/activityScheduleSlice';
import {
  setAddBehindTheScenesActivityModal,
  setAddBoatTripMorningDayActivityModal,
  setAddBoatTripPrivateActivityModal,
  setAddCampingActivitiesModal,
  setAddGameDayDriveActivityModal,
  setExistingBookingActivitiesModal,
  setSelectBookingActivityModal,
  setSelectedActivity,
} from '@/states/features/activitySlice';
import {
  setDeleteBookingActivityModal,
  setExistingBookingActivitiesList,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { Activity } from '@/types/models/activity.types';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListExistingBookingActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { existingBookingActivitiesModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { existingBookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { booking } = useSelector((state: RootState) => state.booking);

  // INITIALIZE FETCH BOOKING ACTIVITIES QUERY
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      isFetching: bookingActivitiesIsFetching,
      isSuccess: bookingActivitiesIsSuccess,
      isError: bookingActivitiesIsError,
      error: bookingActivitiesError,
    },
  ] = useLazyFetchBookingActivitiesQuery();

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    if (selectedActivity && existingBookingActivitiesModal) {
      fetchBookingActivities({
        bookingId: booking?.id,
        size: 100,
        page: 0,
        activityId: selectedActivity?.id,
      });
    }
  }, [
    booking?.id,
    existingBookingActivitiesModal,
    fetchBookingActivities,
    selectedActivity,
  ]);

  // HANDLE FETCH BOOKING ACTIVITIES RESPONSE
  useEffect(() => {
    if (bookingActivitiesIsError) {
      const errorResponse =
        (bookingActivitiesError as ErrorResponse)?.data?.message ||
        'An error occured while fetching booking activities. Please try again later.';
      toast.error(errorResponse);
    } else if (bookingActivitiesIsSuccess) {
      dispatch(
        setExistingBookingActivitiesList(bookingActivitiesData?.data?.rows)
      );
    }
  }, [
    bookingActivitiesIsSuccess,
    bookingActivitiesIsError,
    bookingActivitiesData,
    bookingActivitiesError,
    dispatch,
  ]);

  // EXISTING BOOKING ACTIVITIES COLUMNS
  const existingBookingActivitiesColumns = [
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

  // HANDLE SELECT BOOKING ACTIVITY MODAL
  const handleSelectBookingActivityModal = ({
    activity,
  }: {
    activity: Activity;
  }) => {
    dispatch(setSelectedActivity(activity));
    switch (activity?.slug) {
      case 'behind-the-scenes-tour':
        dispatch(setAddBehindTheScenesActivityModal(true));
        break;
      case 'boat-trip-morning-day':
        dispatch(setAddBoatTripMorningDayActivityModal(true));
        break;
      case 'camping':
      case 'camping-at-mihindi-campsite':
      case 'camping-at-mihindi-for-rwanda-nationals':
      case 'camping-for-rwandan-nationals':
        dispatch(setAddCampingActivitiesModal(true));
        break;
      case 'game-drive-day-amc-operated':
        dispatch(setAddGameDayDriveActivityModal(true));
        break;
      case 'boat-trip–private-non-scheduled':
        dispatch(setAddBoatTripPrivateActivityModal(true));
        break;
      default:
        dispatch(setSelectBookingActivityModal(true));
        break;
    }
  };

  return (
    <Modal
      isOpen={existingBookingActivitiesModal}
      onClose={() => {
        dispatch(setSelectedActivity(undefined));
        dispatch(setExistingBookingActivitiesModal(false));
      }}
      heading={`${selectedActivity?.name} has been added to this booking`}
      className="min-w-[70vw]"
    >
      <section className="w-full flex flex-col gap-5">
        {bookingActivitiesIsFetching ? (
          <figure className="w-full flex flex-col gap-2 min-h-[20vh]">
            <Loader className="text-primary" />
            <p className="text-primary text-[13px]">
              Loading booking activities for {selectedActivity?.name}
            </p>
          </figure>
        ) : (
          <Table
            showFilter={false}
            showPagination={false}
            columns={
              existingBookingActivitiesColumns as ColumnDef<BookingActivity>[]
            }
            data={existingBookingActivitiesList?.map(
              (bookingActivity: BookingActivity, index: number) => {
                return {
                  ...bookingActivity,
                  no: index + 1,
                  date: formatDate(bookingActivity?.startTime),
                  time: `${moment(bookingActivity?.startTime).format(
                    'HH:mm A'
                  )} - 
                    ${moment(bookingActivity?.endTime).format('HH:mm A')}`,
                };
              }
            )}
          />
        )}
        <ul className="flex items-center gap-3 w-full justify-between">
          <Button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedActivity(undefined));
              dispatch(setExistingBookingActivitiesModal(false));
              dispatch(setExistingBookingActivitiesList([]));
              dispatch(setRemainingSeats(0));
            }}
          >
            Close
          </Button>
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setExistingBookingActivitiesList([]));
              dispatch(setExistingBookingActivitiesModal(false));
              handleSelectBookingActivityModal({ activity: selectedActivity });
            }}
          >
            Book again
          </Button>
        </ul>
      </section>
    </Modal>
  );
};

export default ListExistingBookingActivities;
