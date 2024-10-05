import Loader from '@/components/inputs/Loader';
import AdminLayout from '@/containers/AdminLayout';
import { formatDateTime } from '@/helpers/strings.helper';
import { useLazyFetchActivitiesLogsQuery } from '@/states/apiSlice';
import { AppDispatch } from '@/states/store';
import { Logs } from '@/types/models/logs.types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ErrorResponse, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const SystemLogs = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<{
    label: string;
    level: string;
  }>({
    label: 'activities',
    level: 'info',
  });
  const [logsList, setLogsList] = useState<Logs[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Logs[]>([]);

  // LOGS CATEGORIES
  const logsCategories = [
    {
      label: 'activities',
      level: 'info',
    },
    {
      label: 'critical',
      level: 'warn',
    },
    {
      label: 'errors',
      level: 'error',
    },
  ];

  // INITIALIZE FETCH LOGS QUERY
  const [
    fetchLogs,
    {
      data: logsData,
      error: logsError,
      isFetching: logsIsFetching,
      isSuccess: logsIsSuccess,
      isError: logsIsError,
    },
  ] = useLazyFetchActivitiesLogsQuery();

  // FETCH LOGS
  useEffect(() => {
    fetchLogs({});
  }, [fetchLogs]);

  // HANDLE FETCH LOGS RESPONSE
  useEffect(() => {
    if (logsIsError) {
      const errorResponse =
        (logsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching logs';
      toast.error(errorResponse);
    } else if (logsIsSuccess) {
      setLogsList(logsData?.data);
    }
  }, [dispatch, logsData, logsError, logsIsError, logsIsSuccess]);

  // FILTER LOGS
  useEffect(() => {
    if (selectedCategory) {
      setFilteredLogs(
        logsList?.filter((log) => log?.level === selectedCategory?.level)
      );
    }
  }, [dispatch, logsList, selectedCategory]);

  return (
    <AdminLayout>
      <main className="flex flex-col gap-6 w-[95%] mx-auto">
        <nav className="w-full flex items-center gap-2">
          {logsCategories.map((category, index) => {
            const isSelected = selectedCategory?.level === category?.level;
            return (
              <Link
                className={`${
                  isSelected ? 'bg-primary text-white' : 'text-primary bg-white'
                } ${selectedCategory?.level === 'error' && 'bg-red-600'} ${
                  category?.level === 'error' && 'border-red-600 text-red-600'
                } border border-1 text-center w-full rounded-sm p-[6px] px-4`}
                to={`#`}
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category);
                }}
              >
                {category?.label?.toUpperCase()}
              </Link>
            );
          })}
        </nav>
        <section className="w-full flex flex-col gap-3">
          <h2
            className={`text-lg px-2 uppercase font-semibold ${
              selectedCategory?.level === 'error'
                ? 'text-red-600'
                : 'text-primary'
            }`}
          >
            {selectedCategory?.label?.toLocaleUpperCase()} Logs
          </h2>
          {logsIsFetching ? (
            <figure className="w-full min-h-[30vh] flex items-center justify-center">
              <Loader className="text-primary" />
            </figure>
          ) : filteredLogs?.length > 0 ? (
            <menu className="w-full flex flex-col gap-2">
              {filteredLogs?.map((log, index) => {
                return (
                  <article
                    key={index}
                    className="w-full flex flex-col gap-1 p-1 px-2 rounded-md hover:bg-slate-300"
                  >
                    <ul>
                      <p className="text-[13px]">{log?.message}</p>
                    </ul>
                    <ul>
                      <p className="text-primary text-[12px]">
                        {formatDateTime(log?.timestamp)}
                      </p>
                    </ul>
                  </article>
                );
              })}
            </menu>
          ) : (
            <article className="w-full flex-col gap-2 min-h-[40vh] flex items-center justify-center">
              <h3 className="text-primary font-medium">
                No {selectedCategory?.label?.toUpperCase()} logs available
              </h3>
              <p>
                When you have {selectedCategory?.label?.toUpperCase()} logs,
                they will be displayed here.
              </p>
            </article>
          )}
        </section>
      </main>
    </AdminLayout>
  );
};

export default SystemLogs;
