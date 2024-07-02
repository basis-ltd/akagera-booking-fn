import Button from '@/components/inputs/Button';
import Modal from '@/components/modals/Modal';
import { formatDate } from '@/helpers/strings.helper';
import { setSelectBookingActivityModal } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import {
  useCreateBookingActivityMutation,
  useLazyFetchBookingActivitiesQuery,
} from '@/states/apiSlice';
import { ErrorResponse } from 'react-router-dom';
import {
  addBookingActivity,
  setDeleteBookingActivityModal,
  setExistingBookingActivitiesList,
  setSelectedBookingActivity,
} from '@/states/features/bookingActivitySlice';
import Loader from '@/components/inputs/Loader';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Select from '@/components/inputs/Select';
import { setSelectedBookingPeople } from '@/states/features/bookingPeopleSlice';
import { ActivitySchedule } from '@/types/models/activitySchedule.types';
import { formatTime } from '@/helpers/strings.helper';
import moment from 'moment';
import Input from '@/components/inputs/Input';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import Table from '@/components/table/Table';
import { validatePersonAgeRange } from '@/helpers/validations.helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ColumnDef, Row } from '@tanstack/react-table';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const SelectBookingActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectBookingActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { existingBookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const [bookingActivity, setBookingActivity] = useState<{
    startTime: Date | undefined | string;
    bookingId: UUID;
    activityId: UUID | string;
    endTime?: Date | undefined | string;
  }>({
    startTime: booking?.startDate,
    bookingId: booking?.id,
    activityId: selectedActivity?.id,
    endTime: booking?.endDate,
  });

  // REACT HOOK FORM
  const {
    control,
    reset,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  // INITIALIZE CREATE BOOKING ACTIVITY MUTATION
  const [
    createBookingActivity,
    {
      isLoading: createBookingActivityIsLoading,
      error: createBookingActivityError,
      data: createdBookingActivityData,
      isError: createBookingActivityIsError,
      isSuccess: createBookingActivityIsSuccess,
    },
  ] = useCreateBookingActivityMutation();

  // INITIALIZE FETCHING BOOKING ACTIVITIES QUERY
  const [
    fetchBookingActivities,
    {
      data: bookingActivitiesData,
      error: bookingActivitiesError,
      isSuccess: bookingActivitiesIsSuccess,
      isError: bookingActivitiesIsError,
      isFetching: bookingActivitiesIsFetching,
    },
  ] = useLazyFetchBookingActivitiesQuery();

  // FETCH BOOKING ACTIVITIES
  useEffect(() => {
    if (booking) {
      fetchBookingActivities({
        bookingId: booking?.id,
        take: 100,
        skip: 0,
        activityId: selectedActivity?.id,
      });
    }
  }, [
    booking,
    fetchBookingActivities,
    selectedActivity,
    selectBookingActivityModal,
  ]);

  // HANDLE FETCH BOOKING ACTIVITIES RESPONSE
  useEffect(() => {
    if (bookingActivitiesIsError) {
      if ((bookingActivitiesError as ErrorResponse).status === 500) {
        toast.error(
          'An error occured while fetching booking activities. Please try again later.'
        );
      } else {
        toast.error((bookingActivitiesError as ErrorResponse).data.message);
      }
    } else if (bookingActivitiesIsSuccess) {
      dispatch(
        setExistingBookingActivitiesList(bookingActivitiesData?.data?.rows)
      );
    }
  }, [
    bookingActivitiesIsSuccess,
    bookingActivitiesIsError,
    bookingActivitiesData,
    bookingActivitiesError,
    dispatch,
  ]);

  // HANDLE CREATE BOOKING ACTIVITY RESPONSE
  useEffect(() => {
    if (createBookingActivityIsError) {
      if ((createBookingActivityError as ErrorResponse)?.status === 500) {
        toast.error('An error occurred while adding activity to booking');
      } else {
        toast.error(
          (createBookingActivityError as ErrorResponse)?.data?.message
        );
      }
    } else if (createBookingActivityIsSuccess) {
      toast.success('Activity added to booking successfully');
      dispatch(addBookingActivity(createdBookingActivityData?.data));
      dispatch(setSelectedBookingPeople([]));
      reset({
        selectedBookingPeople: null,
      });
      dispatch(setSelectBookingActivityModal(false));
      reset({
        activitySchedule: '',
        numberOfAdults: '',
        numberOfChildren: '',
      });
    }
  }, [
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
    createBookingActivityError,
    dispatch,
    createdBookingActivityData?.data,
    reset,
  ]);

  const onSubmit = (data: FieldValues) => {
    createBookingActivity({
      bookingId: booking?.id,
      activityId: selectedActivity?.id,
      startTime: bookingActivity?.startTime || booking?.startDate,
      endTime: bookingActivity?.endTime || booking?.endDate,
      numberOfAdults: data?.numberOfAdults,
      numberOfChildren: data?.numberOfChildren,
    });
  };

  // EXISTING BOOKING ACTIVITIES COLUMNS
  const existingBookingActivitiesColumns = [
    {
      header: 'No',
      accessorKey: 'no',
    },
    {
      header: 'Date',
      accessorKey: 'date',
    },
    {
      header: 'Time',
      accessorKey: 'time',
    },
    {
      header: 'Number of adults',
      accessorKey: 'numberOfAdults',
    },
    {
      header: 'Number of children',
      accessorKey: 'numberOfChildren',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<BookingActivity> }) => {
        return (
          <menu className="flex items-center gap-2">
            <FontAwesomeIcon
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectedBookingActivity(row?.original));
                dispatch(setDeleteBookingActivityModal(true));
              }}
              className="p-2 transition-all cursor-pointer ease-in-out duration-300 hover:scale-[1.01] px-[9px] rounded-full bg-red-600 text-white"
              icon={faTrash}
            />
          </menu>
        );
      },
    },
  ];

  return (
    <Modal
      isOpen={selectBookingActivityModal}
      onClose={() => {
        dispatch(setSelectBookingActivityModal(false));
        reset({
          activitySchedule: '',
          numberOfAdults: '',
          numberOfChildren: '',
        });
      }}
      heading={`Confirm adding ${selectedActivity.name} to "${
        booking?.name
      } - ${formatDate(booking?.startDate)}"?`}
    >
      {bookingActivitiesIsFetching ? (
        <figure className="w-full min-h-[20vh] flex flex-col gap-2 items-center justify-center">
          <Loader className="text-primary" />
          <p className="text-[15px]">
            Retrieving existing bookings for this activity
          </p>
        </figure>
      ) : existingBookingActivitiesList?.length <= 0 ? (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="grid grid-cols-2 gap-2 w-full">
            <Controller
              name="startDate"
              control={control}
              defaultValue={booking?.startDate as Date}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-1">
                    <Input
                      fromDate={booking?.startDate}
                      toDate={booking?.endDate}
                      type="date"
                      label="Date for this activity"
                      required
                      {...field}
                      defaultValue={booking?.startDate}
                    />
                  </label>
                );
              }}
            />
            {selectedActivity?.activitySchedules &&
              selectedActivity?.activitySchedules?.length > 0 && (
                <Controller
                  name="activitySchedule"
                  control={control}
                  rules={{ required: 'Select from available schedules' }}
                  render={({ field }) => {
                    return (
                      <label className="flex w-full flex-col gap-1">
                        <Select
                          label="Select time slot for this activity"
                          {...field}
                          required
                          onChange={(e) => {
                            field.onChange(e);
                            setBookingActivity({
                              ...bookingActivity,
                              startTime: moment(
                                `${formatDate(booking?.startDate)}T${
                                  e?.split('-')[0]
                                }`
                              ).format(),
                              endTime: moment(
                                `${formatDate(booking?.startDate)}T${
                                  e?.split('-')[1]
                                }`
                              ).format(),
                            });
                          }}
                          options={selectedActivity?.activitySchedules?.map(
                            (activitySchedule: ActivitySchedule) => {
                              return {
                                label: `${formatTime(
                                  activitySchedule.startTime
                                )} - ${formatTime(
                                  String(activitySchedule.endTime)
                                )}`,
                                value: `${activitySchedule.startTime}-${activitySchedule.endTime}`,
                              };
                            }
                          )}
                        />
                        {errors?.activitySchedule && (
                          <InputErrorMessage
                            message={errors?.activitySchedule?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
              )}

            {selectedActivity?.name?.toLowerCase() ===
            'GUIDE FOR SELF-DRIVE GAME DRIVE'?.toLowerCase() ? (
              <Controller
                name="period"
                control={control}
                rules={{ required: 'Select time period' }}
                render={({ field }) => {
                  return (
                    <label className="flex flex-col gap-2">
                      <Select
                        {...field}
                        label="Time Period"
                        options={[
                          { label: 'Full day', value: 'fullDay' },
                          { label: '1/2 Day', value: 'halfDaye' },
                        ]}
                      />
                    </label>
                  );
                }}
              />
            ) : (
              <>
                <Controller
                  name="numberOfAdults"
                  control={control}
                  rules={{
                    required: 'Enter number of adult participants',
                    validate: (value) => {
                      return (
                        validatePersonAgeRange(
                          Number(value),
                          booking?.bookingPeople || [],
                          'adults'
                        ) || 'Add people who have 13 years or more.'
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          {...field}
                          type="number"
                          label="Number of adult participants"
                          required
                          onChange={async (e) => {
                            field.onChange(e.target.value);
                            await trigger('numberOfAdults');
                          }}
                        />
                        {errors?.numberOfAdults && (
                          <InputErrorMessage
                            message={errors?.numberOfAdults?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />

                <Controller
                  name="numberOfChildren"
                  control={control}
                  rules={{
                    required: 'Enter number of children participants',
                    validate: (value) => {
                      return (
                        validatePersonAgeRange(
                          Number(value),
                          booking?.bookingPeople || [],
                          'children'
                        ) || 'Add people who have 6 - 12 years old only.'
                      );
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <label className="w-full flex flex-col gap-1">
                        <Input
                          {...field}
                          type="number"
                          label="Number of children participants"
                          required
                          onChange={async (e) => {
                            field.onChange(e.target.value);
                            await trigger('numberOfChildren');
                          }}
                        />
                        {errors?.numberOfChildren && (
                          <InputErrorMessage
                            message={errors?.numberOfChildren?.message}
                          />
                        )}
                      </label>
                    );
                  }}
                />
              </>
            )}
          </fieldset>

          <menu className="flex items-center gap-3 justify-between mt-3">
            <Button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectBookingActivityModal(false));
              }}
              danger
            >
              Cancel
            </Button>
            <Button className="btn btn-primary" submit primary>
              {createBookingActivityIsLoading ? <Loader /> : 'Confirm'}
            </Button>
          </menu>
        </form>
      ) : (
        <article className="w-full flex flex-col gap-3">
          <p className="text-[15px]">
            This activity has been added to this booking.
          </p>
          <Table
            showFilter={false}
            showPagination={false}
            columns={
              existingBookingActivitiesColumns as ColumnDef<BookingActivity>[]
            }
            data={existingBookingActivitiesList?.map(
              (bookingActivity: BookingActivity, index: number) => {
                return {
                  ...bookingActivity,
                  no: index + 1,
                  date: formatDate(bookingActivity?.startTime),
                  time: `${formatTime(bookingActivity?.startTime)} - 
                      ${formatTime(String(bookingActivity?.endTime))}`,
                };
              }
            )}
          />
          <ul className="flex items-center gap-3 w-full justify-between">
            <Button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setSelectBookingActivityModal(false));
                reset({
                  activitySchedule: '',
                  numberOfAdults: '',
                  numberOfChildren: '',
                });
              }}
            >
              Close
            </Button>
            <Button
              primary
              onClick={(e) => {
                e.preventDefault();
                dispatch(setExistingBookingActivitiesList([]));
              }}
            >
              Book again
            </Button>
          </ul>
        </article>
      )}
    </Modal>
  );
};

export default SelectBookingActivity;
