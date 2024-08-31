import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { Button } from '@/components/ui/button';
import { useLazyFetchPopularActivitiesQuery } from '@/states/apiSlice';
import { AppDispatch } from '@/states/store';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

type PopularActivitesProps = {
  startDate?: Date | string;
  endDate?: Date | string;
  type?: string;
};

const PopularActivites = ({ startDate, endDate, type }: PopularActivitesProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH POPULAR ACTIVITIES
  const [
    fetchPopularActivities,
    {
      data: popularActivitiesData,
      isFetching: popularActivitiesIsFetching,
      isSuccess: popularActivitiesIsSuccess,
      isError: popularActivitiesIsError,
      error: popularActivitiesError,
    },
  ] = useLazyFetchPopularActivitiesQuery();

  // FETCH POPULAR ACTIVITIES
  useEffect(() => {
    fetchPopularActivities({
      size: 5,
      page: 0,
      startDate,
      endDate,
      type,
    });
  }, [endDate, fetchPopularActivities, startDate, type]);

  // HANDLE POPULAR ACTIVITIES RESPONSE
  useEffect(() => {
    if (popularActivitiesIsError) {
      const errorResponse = (popularActivitiesError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || `Failed to fetch popular activities`);
    }
  }, [
    dispatch,
    popularActivitiesData,
    popularActivitiesError,
    popularActivitiesIsError,
    popularActivitiesIsSuccess,
  ]);

  // POPULAR ACTIVITES COLUMNS
  const popularActivitiesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Name',
      accessorKey: 'activity_name',
    },
    {
      header: 'Bookings',
      accessorKey: 'count',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: Row<{
          no: number;
          activity_name: string;
          count: number;
          activity_id: string;
        }>;
      }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="cursor-pointer text-primary hover:text-primary-dark transition-all duration-200 ease-in-out hover:translate-x-1 transform"
              onClick={(e) => {
                e.preventDefault();
                navigate(`activities/${row.original.activity_id}`);
              }}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <menu className="flex flex-col gap-4">
      <ul className="flex items-center gap-3 justify-between">
        <h1 className="text-primary uppercase text-md font-medium">
          Most popular activities
        </h1>
        <Button
          onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard/activities');
          }}
          variant="outline"
          className="text-primary text-[14px] py-1"
        >
          View all
        </Button>
      </ul>
      {popularActivitiesIsFetching ? (
        <figure className="w-full flex items-center justify-center min-h-[20vh]">
          <Loader className="text-primary" />
        </figure>
      ) : (
        <Table
          showFilter={false}
          data={popularActivitiesData?.data?.map(
            (
              bookingActivity: {
                activity_name: string;
                count: number;
              },
              index: number
            ) => {
              return {
                no: index + 1,
                ...bookingActivity,
                activity_name: bookingActivity?.activity_name,
                count: bookingActivity?.count,
              };
            }
          )}
          columns={popularActivitiesColumns}
        />
      )}
    </menu>
  );
};

export default PopularActivites;
