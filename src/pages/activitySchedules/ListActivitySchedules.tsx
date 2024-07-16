import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { activityScheduleColumns } from '@/constants/activitySchedule.constants';
import { useLazyFetchActivitySchedulesQuery } from '@/states/apiSlice';
import {
  setActivityScheduleDetailsModal,
  setActivitySchedulesList,
  setCreateActivityScheduleModal,
  setDeleteActivityScheduleModal,
  setPage,
  setSelectedActivitySchedule,
  setSize,
  setTotalCount,
  setTotalPages,
} from '@/states/features/activityScheduleSlice';
import { setSelectedActivity } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

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

  // ACTIVITY SCHEDULES COLUMNS
  const activityScheduleExtendedColumns = [
    ...activityScheduleColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<ActivitySchedule> }) => {
        return (
          <menu className="flex items-center gap-2">
            <CustomTooltip label="Click to manage">
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivitySchedule(row?.original));
                  dispatch(setActivityScheduleDetailsModal(true));
                }}
                className="text-white p-2 cursor-pointer px-[8.2px] bg-primary rounded-full text-[13px] transition-all duration-300 hover:scale-[1.01]"
              />
            </CustomTooltip>
            <CustomTooltip label="Click to delete">
              <FontAwesomeIcon
                icon={faTrash}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivitySchedule(row?.original));
                  dispatch(setDeleteActivityScheduleModal(true));
                }}
                className="text-white p-2 cursor-pointer px-[8.2px] bg-red-600 rounded-full text-[13px] transition-all duration-300 hover:scale-[1.01]"
              />
            </CustomTooltip>
          </menu>
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
    </section>
  );
};

export default ListActivitySchedules;
