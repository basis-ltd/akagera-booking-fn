import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Table from '@/components/table/Table';
import { activitiesColumns } from '@/constants/activity.constants';
import AdminLayout from '@/containers/AdminLayout';
import { useLazyFetchActivitiesQuery } from '@/states/apiSlice';
import {
  setActivitiesList,
  setCreateActivityModal,
} from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { Activity } from '@/types/models/activity.types';
import { faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListActivities = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { activitiesList } = useSelector((state: RootState) => state.activity);

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH ACTIVITIES QUERY
  const [
    fetchActivities,
    {
      data: activitiesData,
      error: activitiesError,
      isError: activitiesIsError,
      isFetching: activitiesIsFetching,
      isSuccess: activitiesIsSuccess,
    },
  ] = useLazyFetchActivitiesQuery();

  // FETCH ACTIVITIES
  useEffect(() => {
    fetchActivities({ size: 100, page: 0 });
  }, [fetchActivities]);

  // HANDLE FETCH ACTIVITIES RESPONSE
  useEffect(() => {
    if (activitiesIsError) {
      const errorResponse =
        (activitiesError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching activities. Refresh page and try again.';
      toast.error(errorResponse);
    } else if (activitiesIsSuccess) {
      dispatch(
        setActivitiesList(
          activitiesData?.data?.rows?.map((activity: Activity) => {
            return {
              ...activity,
              description:
                activity?.description !== 'NULL' ? activity?.description : '',
              disclaimer:
                activity?.disclaimer !== 'NULL' ? activity?.disclaimer : '',
            };
          })
        )
      );
    }
  }, [
    activitiesData,
    activitiesError,
    activitiesIsError,
    activitiesIsSuccess,
    dispatch,
  ]);

  // ACTIVITIES EXTENDED COLUMNS
  const activitiesExtendedColumns = [
    ...activitiesColumns,
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({
        row,
      }: {
        row: {
          original: Activity;
        };
      }) => {
        return (
          <Button
            className="w-full sm:w-fit !py-[4px]"
            primary
            onClick={(e) => {
              e.preventDefault();
              navigate(`${row?.original?.id}`);
            }}
          >
            <menu className="flex items-center justify-center gap-2 text-[13px]">
              <FontAwesomeIcon icon={faPenToSquare} className="text-[13px]" />
              Manage
            </menu>
          </Button>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <main className="flex flex-col gap-4 p-4 sm:p-6 w-[95%] sm:w-[95%] mx-auto">
        <menu className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <h1 className="text-primary font-semibold text-lg uppercase">
            Activities
          </h1>
          <Button
            primary
            className="w-full sm:w-auto"
            onClick={(e) => {
              e.preventDefault();
              dispatch(setCreateActivityModal(true));
            }}
          >
            <menu className="flex items-center justify-center gap-2">
              <FontAwesomeIcon className="text-[13px]" icon={faPlus} />
              <p className="text-[13px]">Add Activity</p>
            </menu>
          </Button>
        </menu>
        {activitiesIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[50vh] sm:min-h-[70vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <section className="w-full flex flex-col gap-6 overflow-x-clip">
            <Table
              size={100}
              showFilter={false}
              data={activitiesList
                ?.slice()
                .map((activity: Activity, index: number) => {
                  return {
                    ...activity,
                    no: index + 1,
                    description:
                      activity?.description !== 'NULL'
                        ? activity?.description
                        : '',
                    disclaimer:
                      activity?.disclaimer !== 'NULL'
                        ? activity?.disclaimer
                        : '',
                  };
                })}
              columns={activitiesExtendedColumns as ColumnDef<Activity>[]}
            />
          </section>
        )}
      </main>
    </AdminLayout>
  );
};

export default ListActivities;
