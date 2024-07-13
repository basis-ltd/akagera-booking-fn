import Button from '@/components/inputs/Button';
import Input from '@/components/inputs/Input';
import Loader from '@/components/inputs/Loader';
import Modal from '@/components/modals/Modal';
import { generateMonthlyReport } from '@/helpers/exports.helper';
import { useLazyFetchBookingPeopleStatsQuery } from '@/states/apiSlice';
import { setGenerateReportModal } from '@/states/features/dashboardSlice';
import { AppDispatch, RootState } from '@/states/store';
import moment from 'moment';
import { useEffect } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';

const GenerateReport = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { generateReportModal } = useSelector(
    (state: RootState) => state.dashboard
  );

  // REACT HOOK FORM
  const { handleSubmit, control } = useForm();

  // INITIALIZE FETCH BOOKING PEOPLE STATS QUERY
  const [
    fetchBookingPeopleStats,
    {
      data: bookingPeopleStats,
      isFetching: bookingPeopleStatsIsFetching,
      isSuccess: bookingPeopleStatsIsSuccess,
      isError: bookingPeopleStatsIsError,
      error: bookingPeopleStatsError,
    },
  ] = useLazyFetchBookingPeopleStatsQuery();

  // HANDLE SUBMIT
  const onSubmit = (data: FieldValues) => {
    fetchBookingPeopleStats({ month: moment(data?.month).format('YYYY-MM') });
  };

  // HANDLE FETCH BOOKING PEOPLE STATS QUERY
  useEffect(() => {
    if (bookingPeopleStatsIsSuccess) {
      generateMonthlyReport({ bookingPeople: bookingPeopleStats?.data?.rows });
    }
    if (bookingPeopleStatsIsError) {
      const errorResponse =
        (bookingPeopleStatsError as ErrorResponse)?.data?.mesaage ||
        'An error occurred while fetching booking people stats';
      toast.error(errorResponse);
    }
  }, [
    bookingPeopleStatsIsSuccess,
    bookingPeopleStatsIsError,
    bookingPeopleStats,
    bookingPeopleStatsError,
  ]);

  return (
    <Modal
      isOpen={generateReportModal}
      onClose={() => {
        dispatch(setGenerateReportModal(false));
      }}
      heading={'Select month'}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <fieldset className="grid grid-cols-1 w-full gap-4">
          <Controller
            defaultValue={new Date()}
            name="month"
            rules={{ required: 'Select month to generate report' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="text-[12px] text-gray-500" htmlFor="month">
                  <Input
                    selectionType="month"
                    type="month"
                    {...field}
                    currentMonth={field?.value}
                  />
                </label>
              );
            }}
          />
        </fieldset>
        <menu className="w-full flex items-center gap-3 justify-between">
          <Button>Cancel</Button>
          <Button submit primary>
            {bookingPeopleStatsIsFetching ? <Loader /> : 'Generate report'}
          </Button>
        </menu>
      </form>
    </Modal>
  );
};

export default GenerateReport;
