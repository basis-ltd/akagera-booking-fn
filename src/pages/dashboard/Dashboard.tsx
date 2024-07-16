import Button from '@/components/inputs/Button';
import Loader from '@/components/inputs/Loader';
import Select from '@/components/inputs/Select';
import DashboardGraph from '@/components/modals/DashboardGraph';
import AdminLayout from '@/containers/AdminLayout';
import { capitalizeString, formatCurrency } from '@/helpers/strings.helper';
import { useLazyFetchTimeSeriesBookingsQuery } from '@/states/apiSlice';
import { setTimeSeriesBookings } from '@/states/features/bookingSlice';
import { AppDispatch, RootState } from '@/states/store';
import {
  faChevronCircleUp,
  faFileExport,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { Button as CustomButton } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PopularActivites from '@/containers/PopularActivites';
import PopularBookingPeople from '@/containers/PopularBookingPeople';
import DashboardCard from '@/components/modals/DashboardCard';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import { setGenerateReportModal } from '@/states/features/dashboardSlice';
import Input from '@/components/inputs/Input';

const Dashboard = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { timeSeriesBookings } = useSelector(
    (state: RootState) => state.booking
  );
  const [startDate, setStartDate] = useState(
    moment().startOf('month').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'));
  const [type, setType] = useState(``);
  const [metric, setMetric] = useState(`registrations`);
  const [showFilter, setShowFilter] = useState(false);

  // REACT HOOK FORM
  const { control, setValue, reset } = useForm();

  // NAVIGATION
  const navigate = useNavigate();

  // INITIALIZE FETCH TIME SERIES BOOKINGS
  const [
    fetchTimeSeriesBookings,
    {
      data: timeSeriesBookingsData,
      isFetching: timeSeriesBookingsIsFetching,
      isSuccess: timeSeriesBookingsIsSuccess,
      isError: timeSeriesBookingsIsError,
      error: timeSeriesBookingsError,
    },
  ] = useLazyFetchTimeSeriesBookingsQuery();

  // FETCH TIME SERIES BOOKINGS
  useEffect(() => {
    fetchTimeSeriesBookings({ startDate, endDate, type });
  }, [fetchTimeSeriesBookings, startDate, endDate, type]);

  // HANDLE TIME SERIES BOOKINGS RESPONSE
  useEffect(() => {
    if (timeSeriesBookingsIsSuccess) {
      dispatch(setTimeSeriesBookings(timeSeriesBookingsData?.data));
    } else if (timeSeriesBookingsIsError) {
      const errorResponse = (timeSeriesBookingsError as ErrorResponse)?.data
        ?.message;
      toast.error(errorResponse || `Failed to fetch time series bookings`);
    }
  }, [
    dispatch,
    timeSeriesBookingsData?.data,
    timeSeriesBookingsError,
    timeSeriesBookingsIsError,
    timeSeriesBookingsIsSuccess,
  ]);

  return (
    <AdminLayout>
      <main className="w-[95%] mx-auto p-6 flex flex-col gap-6">
        <menu className="flex items-center gap-3 justify-between">
          <h1 className="text-primary uppercase font-semibold text-xl">
            Daily bookings for the month of{' '}
            {moment(startDate).format('MMMM YYYY')}
          </h1>
          <ul className="flex items-center gap-3">
            <CustomButton
              className="!py-1 flex items-center gap-2 text-[14px] default:bg-primary default:text-white"
              variant={'outline'}
              onClick={(e) => {
                e.preventDefault();
                setShowFilter(!showFilter);
              }}
            >
              <FontAwesomeIcon
                className={`text-primary`}
                icon={showFilter ? faChevronCircleUp : faFilter}
              />
              Filter
            </CustomButton>
            <CustomTooltip label="Click to select month">
              <Button
                primary
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setGenerateReportModal(true));
                }}
              >
                <menu className="flex items-center gap-2 text-[14px]">
                  <FontAwesomeIcon icon={faFileExport} />
                  Generate report
                </menu>
              </Button>
            </CustomTooltip>
          </ul>
        </menu>
        {showFilter && (
          <menu className="grid grid-cols-5 gap-6 w-full items-center px-4">
            <Controller
              name="startDate"
              control={control}
              defaultValue={startDate}
              render={({ field }) => {
                return (
                  <label className="w-full">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setStartDate(moment(String(e)).format('YYYY-MM-DD'));
                      }}
                      label="Start date"
                      type="date"
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="endDate"
              control={control}
              defaultValue={endDate}
              render={({ field }) => {
                return (
                  <label className="w-full">
                    <Input
                      type="date"
                      fromDate={startDate as unknown as Date}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setEndDate(moment(String(e)).format('YYYY-MM-DD'));
                      }}
                      label="End date"
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="type"
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full">
                    <Select
                      label="Type"
                      placeholder="Select type"
                      options={['booking', 'registration']?.map((type) => {
                        return {
                          value: type,
                          label: `${capitalizeString(type)}s`,
                        };
                      })}
                      {...field}
                      onChange={(e) => {
                        setValue('type', e);
                        setType(e);
                      }}
                    />
                  </label>
                );
              }}
            />
            <Controller
              name="metric"
              control={control}
              defaultValue={metric}
              render={({ field }) => {
                return (
                  <label className="w-full">
                    <Select
                      label="Metric"
                      placeholder="Select metric"
                      options={[
                        {
                          label: `${capitalizeString(type) || ''} Count`,
                          value: 'registrations',
                        },
                        {
                          label: `${capitalizeString(type) || ''} Revenue`,
                          value: 'revenue',
                        },
                      ]}
                      {...field}
                      onChange={(e) => {
                        setValue('metric', e);
                        setMetric(e);
                      }}
                    />
                  </label>
                );
              }}
            />
            <Link
              to={'#'}
              className="!py-1 text-[14px] justify-self-end text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                reset();
                setStartDate(moment().startOf('month').format('YYYY-MM-DD'));
                setEndDate(moment().endOf('month').format('YYYY-MM-DD'));
                setType(``);
              }}
            >
              Reset Filter
            </Link>
          </menu>
        )}
        <section className="flex flex-col gap-3">
          {timeSeriesBookingsIsFetching ? (
            <figure className="w-full flex items-center justify-center min-h-[50vh]">
              <Loader className="text-primary" />
            </figure>
          ) : (
            <figure className="w-full flex items-start gap-5 h-[50vh]">
              <DashboardGraph
                dataKey="date"
                data={timeSeriesBookings?.map(
                  (booking: {
                    date: string;
                    value: number;
                    totalAmountUsd: number;
                  }) => {
                    return {
                      ...booking,
                      value:
                        metric === `registrations`
                          ? booking.value
                          : booking.totalAmountUsd,
                    };
                  }
                )}
              />
              <menu className="w-[25%] grid grid-rows-2 gap-4">
                <DashboardCard
                  label={`Total ${type ? `${type}s` : ''}`}
                  value={timeSeriesBookings?.reduce(
                    (acc, curr) => acc + curr.value,
                    0
                  )}
                  callToAction={() => {
                    navigate(`/dashboard/bookings`);
                  }}
                />
                <DashboardCard
                  label={`Revenue`}
                  value={`${formatCurrency(
                    timeSeriesBookings?.reduce(
                      (acc, curr) => acc + curr.totalAmountUsd,
                      0
                    )
                  )}`}
                  callToAction={() => {
                    navigate(`/dashboard/bookings`);
                  }}
                />
              </menu>
            </figure>
          )}
        </section>
        <section className="grid grid-cols-2 w-full gap-[5%]">
          <PopularActivites startDate={startDate} endDate={endDate} />
          <PopularBookingPeople startDate={startDate} endDate={endDate} />
        </section>
      </main>
    </AdminLayout>
  );
};

export default Dashboard;
