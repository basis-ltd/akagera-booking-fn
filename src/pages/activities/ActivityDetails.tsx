import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import AdminLayout from '@/containers/AdminLayout';
import { formatDate } from '@/helpers/strings.helper';
import { useLazyGetActivityDetailsQuery } from '@/states/apiSlice';
import {
  setActivity,
  setDeleteActivityModal,
  setSelectedActivity,
  setUpdateActivityModal,
} from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListActivitySchedules from '../activitySchedules/ListActivitySchedules';
import { UUID } from 'crypto';
import ListActivityRates from '../activityRates/ListActivityRates';

const ActivityDetails = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { activity, updateActivityModal } = useSelector(
    (state: RootState) => state.activity
  );

  // NAVIGATION
  const { id } = useParams();

  // INIITALIZE GET ACTIVITY DETAILS QUERY
  const [
    getActivityDetails,
    {
      data: activityData,
      error: activityError,
      isError: activityIsError,
      isFetching: activityIsFetching,
      isSuccess: activityIsSuccess,
    },
  ] = useLazyGetActivityDetailsQuery();

  // FETCH ACTIVITY DETAILS
  useEffect(() => {
    if (id && !updateActivityModal) {
      getActivityDetails({ id });
    }
  }, [getActivityDetails, id, updateActivityModal]);

  // HANDLE FETCH ACTIVITY DETAILS RESPONSE
  useEffect(() => {
    if (activityIsError) {
      const errorResponse =
        (activityError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching activity details. Refresh page and try again.';
      toast.error(errorResponse);
    } else if (activityIsSuccess) {
      dispatch(
        setActivity({
          ...activityData?.data,
          description:
            activityData?.data?.description !== 'NULL'
              ? activityData?.data?.description
              : '',
          disclaimer:
            activityData?.data?.disclaimer !== 'NULL'
              ? activityData?.data?.disclaimer
              : '',
        })
      );
    }
  }, [
    activityData,
    activityError,
    activityIsError,
    activityIsSuccess,
    dispatch,
  ]);

  // BREADCRUMB LINKS
  const breadcrumbLinks = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Activities',
      route: '/dashboard/activities',
    },
    {
      label: `${activity?.name || '...'}`,
      route: `/dashboard/activities/${id}`,
    },
  ];

  return (
    <AdminLayout>
      <main className="w-[90%] mx-auto flex flex-col gap-4 p-6 relative">
        <CustomBreadcrumb navigationLinks={breadcrumbLinks} />
        {activityIsFetching ? (
          <figure className="w-full flex items-center justify-center min-h-[60vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          activityIsSuccess && (
            <section className="w-full flex flex-col gap-8">
              <article className="flex flex-col gap-2 w-full">
                <menu className="w-full flex items-center gap-3 justify-between">
                  <h1 className="text-primary uppercase font-semibold text-xl">
                    {activity?.name}
                  </h1>
                  <Button
                    primary
                    className="!py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSelectedActivity(activity));
                      dispatch(setUpdateActivityModal(true));
                    }}
                  >
                    <menu className="flex items-center gap-2 text-[13px]">
                      <FontAwesomeIcon icon={faPenToSquare} />
                      Update details
                    </menu>
                  </Button>
                </menu>
                <menu className="flex flex-col gap-4">
                  <p className="text-[12px] text-gray-400">
                    Last updated: {formatDate(activity?.updatedAt as Date)}
                  </p>
                  <p className="text-[15px]">
                    Description:{' '}
                    {activity?.description !== 'NULL' && activity?.description}
                  </p>
                  <p className="text-[15px]">
                    Disclaimer:{' '}
                    {activity?.disclaimer !== 'NULL' && activity?.disclaimer}
                  </p>
                </menu>
              </article>
              <ListActivityRates activityId={id as UUID} />
              <ListActivitySchedules activityId={id as UUID} />
            </section>
          )
        )}
        <menu className="w-full flex items-center gap-3 justify-center mt-12">
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedActivity(activity));
              dispatch(setDeleteActivityModal(true));
            }}
          >
            Delete activity
          </Button>
        </menu>
      </main>
    </AdminLayout>
  );
};

export default ActivityDetails;
