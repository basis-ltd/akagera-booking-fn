import Button from '@/components/inputs/Button';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import AdminLayout from '@/containers/AdminLayout';
import {
  capitalizeString,
  formatCurrency,
  formatDate,
  formatTime,
} from '@/helpers/strings.helper';
import { useLazyGetActivityDetailsQuery } from '@/states/apiSlice';
import {
  setActivity,
  setActivityScheduleDetailsModal,
  setCreateActivityScheduleModal,
  setDeleteActivityModal,
  setSelectedActivity,
  setSelectedActivitySchedule,
  setUpdateActivityModal,
} from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
      label: `${activity?.name}`,
      route: `/dashboard/activities/${id}`,
    },
  ];

  return (
    <AdminLayout>
      <main className="w-[90%] mx-auto flex flex-col gap-4 p-6 relative h-[90vh]">
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
              <section className="w-full flex flex-col gap-4">
                <menu className="flex items-center gap-3 justify-between">
                  <h1 className="text-primary uppercase font-medium text-lg">
                    Rates
                  </h1>
                  <Button primary className="!py-1">
                    <menu className="flex items-center gap-2 text-[13px]">
                      <FontAwesomeIcon icon={faPenToSquare} />
                      Manage rates
                    </menu>
                  </Button>
                </menu>
                {(activity?.activityRates?.length ?? 0) > 0 && (
                  <menu className="grid grid-cols-2 gap-5">
                    {activity?.activityRates?.map((rate) => {
                      return (
                        <article
                          className="w-full flex flex-col gap-2"
                          key={rate.id}
                        >
                          <h1>
                            {capitalizeString(rate?.ageRange)} -{' '}
                            {capitalizeString(rate?.name)}
                          </h1>
                          <ul className="flex items-center gap-3">
                            <p>{formatCurrency(Number(rate?.amountUsd))}</p>{' '}
                            {rate?.amountRwf && (
                              <p>
                                {formatCurrency(Number(rate?.amountRwf), 'RWF')}
                              </p>
                            )}
                          </ul>
                        </article>
                      );
                    })}
                  </menu>
                )}
              </section>
              <section className="w-full flex flex-col gap-4">
                <h1 className="text-primary uppercase font-medium text-lg">
                  Schedules
                </h1>
                <menu className="grid grid-cols-3 gap-5">
                  {activity?.activitySchedules?.map((schedule) => {
                    return (
                      <article
                        className="w-full flex flex-col gap-2"
                        key={schedule.id}
                      >
                        <CustomTooltip label="Click to manage">
                          <Link
                            to={'#'}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(setSelectedActivitySchedule(schedule));
                              dispatch(setSelectedActivity(activity));
                              dispatch(setActivityScheduleDetailsModal(true));
                            }}
                            className="flex items-center justify-center gap-2 text-white bg-primary p-1 px-5 rounded-md cursor-pointer transition-all hover:scale-[1.02]"
                          >
                            <p className="text-[14px]">
                              {formatTime(String(schedule?.startTime))}
                            </p>{' '}
                            -
                            <p className="text-[14px]">
                              {formatTime(String(schedule?.endTime))}
                            </p>
                          </Link>
                        </CustomTooltip>
                      </article>
                    );
                  })}
                  <CustomTooltip label="Click to add schedule">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(setSelectedActivity(activity));
                        dispatch(setCreateActivityScheduleModal(true));
                      }}
                    >
                      <menu className="flex items-center gap-2 text-[13px]">
                        <FontAwesomeIcon icon={faCirclePlus} />
                        Add schedule
                      </menu>
                    </Button>
                  </CustomTooltip>
                </menu>
              </section>
            </section>
          )
        )}
        <menu className="w-[95%] flex items-center gap-3 justify-center absolute bottom-12">
          <Button
            danger
            onClick={(e) => {
              e.preventDefault();
              dispatch(setSelectedActivity(activity));
              dispatch(setDeleteActivityModal(true));
            }}
          >
            Delete
          </Button>
        </menu>
      </main>
    </AdminLayout>
  );
};

export default ActivityDetails;
