import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/inputs/Button';
import { Activity } from '../types/models/activity.types';
import { AppDispatch, RootState } from '@/states/store';
import {
  setAddBehindTheScenesActivityModal,
  setAddBoatTripMorningDayActivityModal,
  setAddCampingActivitiesModal,
  setAddGameDayDriveActivityModal,
  setSelectBookingActivityModal,
  setSelectedActivity,
} from '@/states/features/activitySlice';
import { useEffect, useState } from 'react';

type ActivityCardProps = {
  activity: Activity;
};

const ActivityCard = ({ activity }: ActivityCardProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { bookingActivitiesList } = useSelector(
    (state: RootState) => state.bookingActivity
  );
  const { selectBookingActivityModal } = useSelector(
    (state: RootState) => state.activity
  );
  const [activityBooked, setActivityBooked] = useState<boolean>(false);

  // CHECK IF ACTIVITY IS BOOKED
  useEffect(() => {
    if (bookingActivitiesList) {
      setActivityBooked(
        !!bookingActivitiesList.find(
          (bookingActivity) => bookingActivity.activityId === activity.id
        )
      );
    }
  }, [bookingActivitiesList, activity, selectBookingActivityModal]);

  // HANDLE SELECT BOOKING ACTIVITY MODAL
  const handleSelectBookingActivityModal = ({
    activity,
  }: {
    activity: Activity;
  }) => {
    dispatch(setSelectedActivity(activity));
    switch (activity?.slug) {
      case 'behind-the-scenes-tour':
        dispatch(setAddBehindTheScenesActivityModal(true));
        break;
      case 'boat-trip-morning-day':
        dispatch(setAddBoatTripMorningDayActivityModal(true));
        break;
      case 'camping':
      case 'camping-at-mihindi-campsite':
      case 'camping-at-mihindi-for-rwanda-nationals':
      case 'camping-for-rwandan-nationals':
        dispatch(setAddCampingActivitiesModal(true));
        break;
      case 'game-drive-day-amc-operated':
        dispatch(setAddGameDayDriveActivityModal(true));
        break;
      default:
        dispatch(setSelectBookingActivityModal(true));
        break;
    }
  };

  return (
    <section className="flex flex-col gap-6 items-start justify-between w-full p-4 rounded-lg shadow-md min-h-[15vh]">
      <menu className="flex flex-col gap-2">
        <h1 className="text-primary uppercase font-semibold">
          {activity?.name} {activityBooked ? '(Booked)' : ''}
        </h1>
        {activity?.description &&
          activity?.description?.toUpperCase() !== 'NULL' && (
            <ul className="flex items-center gap-2">
              <h3 className="underline font-medium">Description:</h3>
              <p>{activity?.description}</p>
            </ul>
          )}
        {activity?.disclaimer &&
          activity?.disclaimer?.toUpperCase() !== 'NULL' && (
            <ul className="flex items-center gap-2">
              <h3 className="underline font-medium">Disclaimer:</h3>
              <p>{activity?.disclaimer}</p>
            </ul>
          )}
        <ul className="flex items-start flex-col gap-2 mt-4">
          <h3 className="uppercase font-bold">Prices</h3>
          <ul className="flex flex-col items-start gap-1">
            <h4 className="underline font-medium">Adults:</h4>
            {activity?.activityRates
              ?.filter((activityRate) => activityRate.ageRange === 'adults')
              ?.map((activityRate) => {
                return (
                  <li key={activityRate.id} className="flex items-center gap-2">
                    <p>
                      {activityRate?.name && `${activityRate?.name}`}
                      {' - '}
                      {`$${activityRate?.amountUsd}`}{' '}
                      {activityRate?.amountRwf &&
                        `| RWF${activityRate.amountRwf}`}
                    </p>
                  </li>
                );
              })}
          </ul>
          {activity?.activityRates?.filter(
            (activityRate) => activityRate.ageRange === 'children'
          )?.length > 0 && (
            <ul className="flex flex-col items-start gap-1">
              <h4 className="underline font-medium">Children:</h4>
              {activity?.activityRates
                ?.filter((activityRate) => activityRate.ageRange === 'children')
                ?.map((activityRate) => {
                  return (
                    <li
                      key={activityRate.id}
                      className="flex items-center gap-2"
                    >
                      <p>
                        {activityRate?.name && `${activityRate.name} - `}
                        {`$${activityRate?.amountUsd}`}{' '}
                        {activityRate?.amountRwf &&
                          `| RWF${activityRate.amountRwf}`}
                      </p>
                    </li>
                  );
                })}
            </ul>
          )}
        </ul>
      </menu>
      <menu className="text-center flex flex-col gap-2 w-full items-center">
        <Button
          className={`!py-1 ${activityBooked ? '!bg-gray-600' : ''}`}
          primary
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedActivity(activity));
            handleSelectBookingActivityModal({ activity });
          }}
        >
          {activityBooked ? 'View Booking' : 'Book Activity'}
        </Button>
      </menu>
    </section>
  );
};

export default ActivityCard;
