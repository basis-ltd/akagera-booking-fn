import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import Table from '@/components/table/Table';
import { seatsAdjustmentsColumns } from '@/constants/activitySchedule.constants';
import { useLazyFetchSeatsAdjustmentsQuery } from '@/states/apiSlice';
import {
  setCreateSeatsAdjustmentsModal,
  setDeleteSeatsAdjustmentModal,
  setManageSeatsAdjustmentsModal,
  setSeatsAdjustmentsList,
  setSelectedActivitySchedule,
  setSelectedSeatsAdjustment,
} from '@/states/features/activityScheduleSlice';
import { AppDispatch, RootState } from '@/states/store';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Row } from '@tanstack/react-table';
import { SeatsAdjustment } from '@/types/models/activitySchedule.types';
import CustomTooltip from '@/components/inputs/CustomTooltip';

const ManageSeatsAdjustments = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    manageSeatsAdjustmentsModal,
    selectedActivitySchedule,
    seatsAdjustmentsList,
  } = useSelector((state: RootState) => state.activitySchedule);

  // INITIALIZE FETCH SEATS ADJUSTMENTS QUERY
  const [
    fetchSeatsAdjustments,
    {
      data: seatsAdjustmentsData,
      error: seatsAdjustmentsError,
      isError: seatsAdjustmentsIsError,
      isFetching: seatsAdjustmentsIsFetching,
      isSuccess: seatsAdjustmentsIsSuccess,
    },
  ] = useLazyFetchSeatsAdjustmentsQuery();

  // FETCH SEATS ADJUSTMENTS
  useEffect(() => {
    if (selectedActivitySchedule) {
      fetchSeatsAdjustments({
        activityScheduleId: selectedActivitySchedule.id,
      });
    }
  }, [fetchSeatsAdjustments, selectedActivitySchedule]);

  // HANDLE FETCH SEATS ADJUSTMENTS RESPONSE
  useEffect(() => {
    if (seatsAdjustmentsIsSuccess) {
      dispatch(setSeatsAdjustmentsList(seatsAdjustmentsData?.data?.rows));
    } else if (seatsAdjustmentsIsError) {
      const errorResponse =
        (seatsAdjustmentsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching seats adjustments. Refresh page and try again.';
      toast.error(errorResponse);
    }
  }, [
    seatsAdjustmentsIsSuccess,
    seatsAdjustmentsIsError,
    dispatch,
    seatsAdjustmentsData?.data?.rows,
    seatsAdjustmentsError,
  ]);

  // SEATS ADJUSTMENTS EXTENDED COLUMNS
  const seatsAdjustmentsExtendedColumns = [
    ...seatsAdjustmentsColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      disableFilters: true,
      disableSortBy: true,
      cell: ({ row }: { row: Row<SeatsAdjustment> }) => {
        return (
          <CustomTooltip label="Click to delete">
            <FontAwesomeIcon
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedSeatsAdjustment(row.original));
                dispatch(setManageSeatsAdjustmentsModal(false));
                dispatch(setDeleteSeatsAdjustmentModal(true));
              }}
            />
          </CustomTooltip>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={manageSeatsAdjustmentsModal}
      onClose={() => {
        dispatch(setSelectedActivitySchedule(undefined));
        dispatch(setManageSeatsAdjustmentsModal(false));
      }}
      className="min-w-[65vw]"
      heading={`Manage seats adjustments for ${selectedActivitySchedule?.startTime} - ${selectedActivitySchedule?.endTime}`}
    >
      {seatsAdjustmentsIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[30vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <section className="w-full flex flex-col gap-4 items-end">
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              dispatch(setManageSeatsAdjustmentsModal(false));
              dispatch(setCreateSeatsAdjustmentsModal(true));
            }}
          >
            <menu className="w-full flex items-center gap-2 text-[13px]">
              <FontAwesomeIcon icon={faPlus} />
              Add new
            </menu>
          </Button>
          <Table
            showFilter={false}
            showPagination={false}
            columns={seatsAdjustmentsExtendedColumns}
            data={seatsAdjustmentsList}
          />
        </section>
      )}
    </Modal>
  );
};

export default ManageSeatsAdjustments;
