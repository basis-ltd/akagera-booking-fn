import Button from '@/components/inputs/Button';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Modal from '@/components/modals/Modal';
import { formatDate, generateRecurringEvents } from '@/helpers/strings';
import { setSelectBookingActivityModal } from '@/states/features/activitySlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEffect, useState } from 'react';
import { UUID } from 'crypto';
import { toast } from 'react-toastify';
import { useCreateBookingActivityMutation } from '@/states/apiSlice';
import { ErrorResponse } from 'react-router-dom';
import { addBookingActivity } from '@/states/features/bookingActivitySlice';
import Loader from '@/components/inputs/Loader';

const SelectBookingActivity = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { selectBookingActivityModal, selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const { booking } = useSelector((state: RootState) => state.booking);
  const [bookingActivity, setBookingActivity] = useState<{
    startTime: Date | undefined | string;
    bookingId: UUID;
    activityId: UUID | string;
  }>({
    startTime: booking?.startDate,
    bookingId: booking?.id,
    activityId: selectedActivity?.id,
  });

  // CALENDAR LOCALIZER
  const localizer = momentLocalizer(moment);

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
      dispatch(addBookingActivity(createdBookingActivityData?.data));
      dispatch(setSelectBookingActivityModal(false));
    }
  }, [
    createBookingActivityIsSuccess,
    createBookingActivityIsError,
    createBookingActivityError,
    dispatch,
    createdBookingActivityData?.data,
  ]);

  return (
    <Modal
      isOpen={selectBookingActivityModal}
      onClose={() => {
        dispatch(setSelectBookingActivityModal(false));
      }}
      heading={`Confirm adding ${selectedActivity.name} to "${
        booking?.name
      } - ${formatDate(booking?.startDate)}"?`}
    >
      <menu className="flex flex-col gap-2 w-full">
        {selectedActivity?.activitySchedules &&
          selectedActivity?.activitySchedules?.length > 0 && (
            <section className="flex w-full flex-col gap-4 my-3 max-w-[50vw]">
              <article className="flex flex-col gap-1">
                <h3 className="uppercase font-bold w-full">Schedule</h3>
                <p className="text-[13px]">
                  Select a timeslot to book a schedule for this activity. If
                  your booking day does not have avaialable schedules, consider
                  other activities or change your booking day.
                </p>
              </article>
              <Calendar
                className="!h-[60vh]"
                events={generateRecurringEvents(selectedActivity)}
                localizer={localizer}
                defaultView="day"
                defaultDate={booking?.startDate}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={(event) => {
                  setBookingActivity({
                    ...bookingActivity,
                    startTime: moment(event.start).format(),
                  });
                }}
              />
            </section>
          )}

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
          <Button
            className="btn btn-primary"
            onClick={(e) => {
              e.preventDefault();
              if (!bookingActivity?.startTime || bookingActivity?.startTime === undefined) {
                toast.error('Please select a schedule for this activity');
                return;
              }
              createBookingActivity({
                bookingId: bookingActivity?.bookingId,
                activityId: bookingActivity?.activityId || selectedActivity?.id,
                startTime: bookingActivity?.startTime,
              });
            }}
            primary
          >
            {createBookingActivityIsLoading ? <Loader /> : 'Confirm'}
          </Button>
        </menu>
      </menu>
    </Modal>
  );
};

export default SelectBookingActivity;
