import Button from '@/components/inputs/Button';
import CustomPopover from '@/components/inputs/CustomPopover';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { activityScheduleColumns } from '@/constants/activitySchedule.constants';
import { useLazyFetchActivitySchedulesQuery } from '@/states/apiSlice';
import {
  setActivityScheduleDetailsModal,
  setActivitySchedulesList,
  setCreateActivityScheduleModal,
  setDeleteActivityScheduleModal,
  setManageSeatsAdjustmentsModal,
  setPage,
  setSelectedActivitySchedule,
  setSize,
  setTotalCount,
  setTotalPages,
} from '@/states/features/activityScheduleSlice';
import { setSelectedActivity } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import {
  faEllipsisH,
  faPenToSquare,
  faPlus,
  faSliders,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateSeatsAdjustments from './CreateSeatsAdjustments';
import ManageSeatsAdjustments from './ManageSeatsAdjustments';
import DeleteSeatsAdjustment from './DeleteSeatsAdjustment';

type ListActivitySchedulesProps = {
  activityId: UUID;
};

const ListActivitySchedules = ({ activityId }: ListActivitySchedulesProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    activitySchedulesList,
    size,
    page,
    totalCount,
    totalPages,
    activityScheduleDetailsModal,
  } = useSelector((state: RootState) => state.activitySchedule);
  const { activity } = useSelector((state: RootState) => state.activity);
  const [transportationsLabel, setTransportationsLabel] =
    useState<string>('seats');

  // INITIALIZE FETCH ACTIVITY SCHEDULES QUERY
  const [
    fetchActivitySchedules,
    {
      data: activitySchedulesData,
      error: activitySchedulesError,
      isFetching: activitySchedulesIsFetching,
      isSuccess: activitySchedulesIsSuccess,
      isError: activitySchedulesIsError,
    },
  ] = useLazyFetchActivitySchedulesQuery();

  // FETCH ACTIVITY SCHEDULES
  useEffect(() => {
    if (!activityScheduleDetailsModal) {
      fetchActivitySchedules({ page, size, activityId });
    }
  }, [
    fetchActivitySchedules,
    page,
    size,
    activityId,
    activityScheduleDetailsModal,
  ]);

  // HANDLE FETCH ACTIVITY SCHEDULES RESPONSE
  useEffect(() => {
    if (activitySchedulesIsSuccess) {
      dispatch(setActivitySchedulesList(activitySchedulesData?.data?.rows));
      dispatch(setTotalCount(activitySchedulesData?.data?.totalCount));
      dispatch(setTotalPages(activitySchedulesData?.data?.totalPages));
    } else if (activitySchedulesIsError) {
      const errorResponse = (activitySchedulesError as ErrorResponse)?.data
        ?.message;
      toast.error(
        errorResponse || 'Failed to fetch activity schedules. Please try again.'
      );
    }
  }, [
    activitySchedulesIsSuccess,
    activitySchedulesData,
    dispatch,
    activitySchedulesIsError,
    activitySchedulesError,
  ]);

  // SET TRANSPORTATIONS LABEL
  useEffect(() => {
    switch (activity?.slug) {
      case 'behind-the-scenes-tour':
        setTransportationsLabel('participants');
        break;
      case 'boat-trip-morning-day':
      case 'boat-trip-morning-day-amc-operated':
      case 'boat-trip-sunset-trip':
        setTransportationsLabel('seats');
        break;
      case 'camping':
      case 'camping-at-mihindi-campsite':
      case 'camping-at-mihindi-for-rwanda-nationals':
      case 'camping-for-rwandan-nationals':
        setTransportationsLabel('tents');
        break;
      case 'game-drive-day-amc-operated':
      case 'night-drive-operated-by-amc':
        setTransportationsLabel('cars');
        break;
      case 'boat-trip–private-non-scheduled':
        setTransportationsLabel('participants');
        break;
      default:
        setTransportationsLabel('transportations');
        break;
    }
  }, [activity]);

  // ACTIVITY SCHEDULES COLUMNS
  const activityScheduleExtendedColumns = [
    ...activityScheduleColumns,
    {
      header: `Number of ${transportationsLabel}`,
      accessorKey: 'numberOfSeats',
      cell: ({ row }: { row: Row<ActivitySchedule> }) =>
        row?.original?.numberOfSeats,
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<ActivitySchedule> }) => {
        return (
          <CustomPopover
            trigger={
              <FontAwesomeIcon
                icon={faEllipsisH}
                className="p-1 px-2 rounded-md text-primary bg-slate-200 hover:bg-slate-300 cursor-pointer"
              />
            }
          >
            <menu className="flex flex-col items-center gap-2">
              <Link
                to={`#`}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivity(activity));
                  dispatch(setSelectedActivitySchedule(row?.original));
                  dispatch(setActivityScheduleDetailsModal(true));
                }}
                className="w-full flex items-center gap-2 text-[13px] p-1 px-2 rounded-md cursor-pointer hover:bg-background"
              >
                <FontAwesomeIcon
                  className="text-primary hover:scale-[1.01]"
                  icon={faPenToSquare}
                />
                Manage schedule
              </Link>
              <Link
                to={`#`}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivity(activity));
                  dispatch(setSelectedActivitySchedule(row?.original));
                  dispatch(setManageSeatsAdjustmentsModal(true));
                }}
                className="w-full flex items-center gap-2 text-[13px] p-1 px-2 rounded-md cursor-pointer hover:bg-background"
              >
                <FontAwesomeIcon
                  className="text-primary hover:scale-[1.01]"
                  icon={faSliders}
                />
                Adjust schedule
              </Link>
              <Link
                to={`#`}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivitySchedule(row?.original));
                  dispatch(setDeleteActivityScheduleModal(true));
                }}
                className="w-full flex items-center gap-2 text-[13px] p-1 px-2 rounded-md cursor-pointer hover:bg-background"
              >
                <FontAwesomeIcon
                  className="text-red-600 hover:scale-[1.01]"
                  icon={faTrash}
                />
                Delete schedule
              </Link>
            </menu>
          </CustomPopover>
        );
      },
    },
  ];

  return (
    <section className="w-full flex flex-col gap-6 my-4">
      <menu className="flex items-center gap-3 justify-between">
        <h1 className="uppercase text-primary text-md font-medium">
          Schedules
        </h1>
        <Button
          primary
          className="!py-1"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setCreateActivityScheduleModal(true));
            dispatch(setSelectedActivity(activity));
          }}
        >
          <menu className="flex items-center gap-2 text-[13px]">
            <FontAwesomeIcon icon={faPlus} />
            Add schedule
          </menu>
        </Button>
      </menu>
      {activitySchedulesIsFetching ? (
        <figure className="w-full min-h-[30vh] flex items-center justify-center">
          {' '}
          <Loader className="text-primary" />
        </figure>
      ) : (
        <Table
          showFilter={false}
          size={size}
          page={page}
          totalCount={totalCount}
          totalPages={totalPages}
          setSize={setSize}
          setPage={setPage}
          columns={activityScheduleExtendedColumns}
          data={activitySchedulesList}
        />
      )}
      <CreateSeatsAdjustments />
      <ManageSeatsAdjustments />
      <DeleteSeatsAdjustment />
    </section>
  );
};

export default ListActivitySchedules;
