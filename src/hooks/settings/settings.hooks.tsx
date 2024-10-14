import CustomTooltip from '@/components/inputs/CustomTooltip';
import { formatDateTime } from '@/helpers/strings.helper';
import {
  useLazyFetchAdminEmailHistoryQuery,
  useLazyFetchSettingsQuery,
  useLazyFetchUsdRateHistoryQuery,
} from '@/states/apiSlice';
import {
  setSelectedSettings,
  setSettingsList,
  setUpdateAdminEmailModal,
  setUpdateUsdRateModal,
} from '@/states/settingsSlice';
import { AppDispatch, RootState } from '@/states/store';
import { Settings } from '@/types/models/settings.types';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Row } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useFetchUsdRateHistory = () => {
  // INITIALIZE FETCH USD RATE HISTORY
  const [
    fetchUsdRateHistory,
    {
      data: usdRateHistoryData,
      isFetching: usdRateHistoryIsFetching,
      isSuccess: usdRateHistoryIsSuccess,
      isError: usdRateHistoryIsError,
      error: usdRateHistoryError,
    },
  ] = useLazyFetchUsdRateHistoryQuery();

  // FETCH USD RATE HISTORY
  useEffect(() => {
    fetchUsdRateHistory({});
  }, [fetchUsdRateHistory]);

  // HANDLE FETCH USD RATE HISTORY REPONSE
  useEffect(() => {
    if (usdRateHistoryIsError) {
      const errorMessage =
        (usdRateHistoryError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching the USD rate history';
      toast.error(errorMessage);
    }
  }, [
    usdRateHistoryIsSuccess,
    usdRateHistoryIsError,
    usdRateHistoryData,
    usdRateHistoryError,
  ]);

  return {
    fetchUsdRateHistory,
    usdRateHistoryData,
    usdRateHistoryIsFetching,
    usdRateHistoryIsSuccess,
    usdRateHistoryIsError,
    usdRateHistoryError,
  };
};

export const useFetchAdminEmailHistory = () => {
  // STATE VARIABLES

  // INITIALIZE FETCH ADMIN EMAIL HISTORY
  const [
    fetchAdminEmailHistory,
    {
      data: adminEmailHistoryData,
      isFetching: adminEmailHistoryIsFetching,
      isSuccess: adminEmailHistoryIsSuccess,
      isError: adminEmailHistoryIsError,
      error: adminEmailHistoryError,
    },
  ] = useLazyFetchAdminEmailHistoryQuery();

  // FETCH ADMIN EMAIL HISTORY
  useEffect(() => {
    fetchAdminEmailHistory({});
  }, [fetchAdminEmailHistory]);

  // HANDLE FETCH ADMIN EMAIL HISTORY RESPONSE
  useEffect(() => {
    if (adminEmailHistoryIsError) {
      const errorMessage =
        (adminEmailHistoryError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching the admin email history';
      toast.error(errorMessage);
    }
  }, [
    adminEmailHistoryIsSuccess,
    adminEmailHistoryIsError,
    adminEmailHistoryData,
    adminEmailHistoryError,
  ]);

  return {
    fetchAdminEmailHistory,
    adminEmailHistoryData,
    adminEmailHistoryIsFetching,
    adminEmailHistoryIsSuccess,
    adminEmailHistoryIsError,
    adminEmailHistoryError,
  };
};

export const useUsdRateColumns = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  const usdRateColumns = useMemo(
    () => [
      {
        header: 'No',
        accessorKey: 'no',
        cell: ({ row }: { row: Row<{ no: number }> }) => row.index + 1,
      },
      {
        header: 'USD Rate',
        accessorKey: 'usdRate',
      },
      {
        header: 'Last updated',
        accessorKey: 'updatedAt',
        cell: ({ row }: { row: Row<{ updatedAt: string }> }) =>
          formatDateTime(row.original.updatedAt),
      },
      {
        header: 'Last updated by',
        accessorKey: 'user.name',
      },
      {
        header: 'Action',
        cell: ({ row }: { row: Row<Settings> }) => {
          return (
            <CustomTooltip label="Click to update">
              <FontAwesomeIcon
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedSettings(row?.original));
                  dispatch(setUpdateUsdRateModal(true));
                }}
                icon={faPenToSquare}
                className="text-white bg-primary rounded-full p-2 cursor-pointer"
              />
            </CustomTooltip>
          );
        },
      },
    ],
    [dispatch]
  );

  return usdRateColumns;
};

export const useAdminEmailColumns = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  const adminEmailColumns = useMemo(
    () => [
      {
        header: 'No',
        accessorKey: 'no',
        cell: ({ row }: { row: Row<{ no: number }> }) => row.index + 1,
      },
      {
        header: 'Email',
        accessorKey: 'adminEmail',
      },
      {
        header: 'Last updated',
        accessorKey: 'updatedAt',
        cell: ({ row }: { row: Row<{ updatedAt: string }> }) =>
          formatDateTime(row.original.updatedAt),
      },
      {
        header: 'Last updated by',
        accessorKey: 'user.name',
      },
      {
        header: 'Action',
        cell: ({ row }: { row: Row<Settings> }) => {
          return (
            <CustomTooltip label="Click to update">
              <FontAwesomeIcon
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setSelectedSettings(row?.original));
                  dispatch(setUpdateAdminEmailModal(true));
                }}
                icon={faPenToSquare}
                className="text-white bg-primary rounded-full p-2 cursor-pointer"
              />
            </CustomTooltip>
          );
        },
      },
    ],
    [dispatch]
  );

  return adminEmailColumns;
};

export const useFetchSettings = () => {
  // STATE VARIABLES
  const dispatch = useDispatch();
  const { settingsList } = useSelector((state: RootState) => state.settings);

  // INITIALIZE FETCH SETTINGS
  const [
    fetchSettings,
    {
      data: settingsData,
      isFetching: settingsIsFetching,
      isSuccess: settingsIsSuccess,
      isError: settingsIsError,
      error: settingsError,
    },
  ] = useLazyFetchSettingsQuery();

  useEffect(() => {
    fetchSettings({});
  }, [fetchSettings]);

  useEffect(() => {
    if (settingsIsSuccess) {
      dispatch(setSettingsList(settingsData?.data));
    } else if (settingsIsError) {
      const errorMessage =
        (settingsError as ErrorResponse)?.data?.message ||
        'An error occurred while fetching the settings';
      toast.error(errorMessage);
    }
  }, [
    settingsIsSuccess,
    settingsData,
    dispatch,
    settingsIsError,
    settingsError,
  ]);

  return {
    settingsList,
    settingsIsFetching,
    settingsIsSuccess,
    settingsIsError,
    settingsError,
  };
};
