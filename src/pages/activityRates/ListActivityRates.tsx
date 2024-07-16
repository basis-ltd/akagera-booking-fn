import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { activityRateColumns } from '@/constants/activityRate.constants';
import { useLazyFetchActivityRatesQuery } from '@/states/apiSlice';
import {
  setActivityRatesList,
  setCreateActivityRateModal,
  setDeleteActivityRateModal,
  setPage,
  setSelectedActivityRate,
  setSize,
  setTotalCount,
  setTotalPages,
  setUpdateActivityRateModal,
} from '@/states/features/activityRateSlice';
import { setSelectedActivity } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { ActivityRate } from '@/types/models/activityRate.types';
import {
  faPenToSquare,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { UUID } from 'crypto';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

type ListActivityRatesProps = {
  activityId: UUID;
};

const ListActivityRates = ({ activityId }: ListActivityRatesProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    activityRatesList,
    size,
    page,
    totalCount,
    totalPages,
    updateActivityRateModal,
  } = useSelector((state: RootState) => state.activityRate);
  const { activity } = useSelector((state: RootState) => state.activity);

  // INITIALIZE FETCH ACTIVITY RATES QUERY
  const [
    fetchActivityRates,
    {
      data: activityRatesData,
      error: activityRatesError,
      isFetching: activityRatesIsFetching,
      isSuccess: activityRatesIsSuccess,
      isError: activityRatesIsError,
    },
  ] = useLazyFetchActivityRatesQuery();

  // FETCH ACTIVITY RATES
  useEffect(() => {
    if (!updateActivityRateModal) {
      fetchActivityRates({ page, size, activityId });
    }
  }, [fetchActivityRates, page, size, activityId, updateActivityRateModal]);

  // HANDLE FETCH ACTIVITY RATES RESPONSE
  useEffect(() => {
    if (activityRatesIsSuccess) {
      dispatch(setActivityRatesList(activityRatesData?.data?.rows));
      dispatch(setTotalCount(activityRatesData?.data?.totalCount));
      dispatch(setTotalPages(activityRatesData?.data?.totalPages));
    } else if (activityRatesIsError) {
      const errorResponse = (activityRatesError as ErrorResponse)?.data
        ?.message;
      toast.error(
        errorResponse || 'Failed to fetch activity rates. Please try again.'
      );
    }
  }, [
    activityRatesIsSuccess,
    activityRatesData,
    dispatch,
    activityRatesIsError,
    activityRatesError,
  ]);

  // ACTIVITY RATES COLUMNS
  const activityRatesExtendedColumns = [
    ...activityRateColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<ActivityRate> }) => {
        return (
          <menu className="flex items-center gap-2">
            <CustomTooltip label="Click to manage">
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivityRate(row?.original));
                  dispatch(setUpdateActivityRateModal(true));
                }}
                className="text-white p-2 cursor-pointer px-[8.2px] bg-primary rounded-full text-[13px] transition-all duration-300 hover:scale-[1.01]"
              />
            </CustomTooltip>
            <CustomTooltip label="Click to delete">
              <FontAwesomeIcon
                icon={faTrash}
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedActivityRate(row?.original));
                  dispatch(setDeleteActivityRateModal(true));
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
    <section className="w-full flex flex-col gap-6">
      <menu className="flex items-center gap-3 justify-between">
        <h1 className="uppercase text-primary text-md font-medium">Rates</h1>
        <Button
          primary
          className="!py-1"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedActivity(activity));
            dispatch(setCreateActivityRateModal(true));
          }}
        >
          <menu className="flex items-center gap-2 text-[13px]">
            <FontAwesomeIcon icon={faPlus} />
            Add rate
          </menu>
        </Button>
      </menu>
      {activityRatesIsFetching ? (
        <figure className="w-full min-h-[20vh] flex justify-center items-center">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <Table
          showFilter={false}
          data={activityRatesList}
          columns={activityRatesExtendedColumns}
          page={page}
          size={size}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setSize={setSize}
        />
      )}
    </section>
  );
};

export default ListActivityRates;
