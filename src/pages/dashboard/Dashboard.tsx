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

const Dashboard = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { timeSeriesBookings } = useSelector(
    (state: RootState) => state.booking
  );
  const [granularity, setGranularity] = useState(`day`);
  const [month, setMonth] = useState(moment().format('M'));
  const [year, setYear] = useState(moment().format('YYYY'));
  const [type, setType] = useState(``);
  const [metric, setMetric] = useState(`registrations`);
  const [showFilter, setShowFilter] = useState(false);

  // REACT HOOK FORM
  const { control, setValue, reset, watch } = useForm();

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
    fetchTimeSeriesBookings({ granularity, month, year, type });
  }, [fetchTimeSeriesBookings, granularity, month, type, year]);

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
            {granularity === `day`
              ? `Daily bookings for the month of ${moment(month).format(
                  'MMMM'
                )}`
              : granularity === `month` &&
                `Monthly bookings for the year ${moment(year).format('YYYY')}`}
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
            <Button className="!py-[6px]" primary>
              <menu className="flex items-center gap-2 text-[14px]">
                <FontAwesomeIcon icon={faFileExport} />
                Generate report
              </menu>
            </Button>
          </ul>
        </menu>
        {showFilter && (
          <menu className="grid grid-cols-5 gap-6 w-full items-center px-4">
            <Controller
              name="granularity"
              control={control}
              defaultValue={granularity}
              render={({ field }) => {
                return (
                  <label className="w-full">
                    <Select
                      label="Granularity"
                      placeholder="Select granularity"
                      options={['day', 'month']?.map((granularity) => {
                        return {
                          value: granularity,
                          label: capitalizeString(granularity),
                        };
                      })}
                      {...field}
                      onChange={(e) => {
                        setValue('granularity', e);
                        setGranularity(e);
                      }}
                    />
                  </label>
                );
              }}
            />
            {watch('granularity') === 'day' && (
              <Controller
                name="month"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-full">
                      <Select
                        label="Month"
                        placeholder="Select month"
                        options={moment.months()?.map((month, index) => {
                          return {
                            value: String(index + 1),
                            label: capitalizeString(month),
                          };
                        })}
                        {...field}
                        onChange={(e) => {
                          setValue('month', e);
                          setMonth(e);
                        }}
                      />
                    </label>
                  );
                }}
              />
            )}
            {watch('granularity') === 'month' && (
              <Controller
                name="year"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-full">
                      <Select
                        label="Year"
                        placeholder="Select year"
                        options={[...Array(10).keys()].map((_, index) => {
                          return {
                            value: String(moment().year() - index),
                            label: String(moment().year() - index),
                          };
                        })}
                        {...field}
                        onChange={(e) => {
                          setValue('year', e);
                          setYear(e);
                        }}
                      />
                    </label>
                  );
                }}
              />
            )}
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
                          label: capitalizeString(type),
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
                      options={['registrations', 'revenue']?.map((type) => {
                        return {
                          value: type,
                          label: capitalizeString(type),
                        };
                      })}
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
                setGranularity(`day`);
                setMonth(moment().format('M'));
                setYear(moment().format('YYYY'));
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
                    navigate(`/dashboard/registrations`);
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
                    navigate(`/dashboard/registrations`);
                  }}
                />
              </menu>
            </figure>
          )}
        </section>
        <section className="grid grid-cols-2 w-full gap-[5%]">
          <PopularActivites />
          <PopularBookingPeople />
        </section>
      </main>
    </AdminLayout>
  );
};

export default Dashboard;
