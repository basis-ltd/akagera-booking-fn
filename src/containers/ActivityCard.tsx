import { useDispatch } from 'react-redux';
import Button from '../components/inputs/Button';
import { Activity } from '../types/models/activity.types';
import { AppDispatch } from '@/states/store';
import {
  setSelectBookingActivityModal,
  setSelectedActivity,
} from '@/states/features/activitySlice';

type ActivityCardProps = {
  activity: Activity;
};

const ActivityCard = ({ activity }: ActivityCardProps) => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <section className="flex flex-col items-center justify-between w-full p-4 rounded-lg shadow-md min-h-[15vh]">
      <menu className="flex flex-col gap-2">
        <h1 className="font-medium text-md text-center mb-2">
          {activity.name}
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2">
          {activity?.description}
        </p>
      </menu>
      <menu className="text-center flex flex-col gap-2 w-full items-center">
        <Button
          className="!py-1"
          primary
          onClick={(e) => {
            e.preventDefault();
            dispatch(setSelectedActivity(activity));
            dispatch(setSelectBookingActivityModal(true));
          }}
        >
          Select
        </Button>
      </menu>
    </section>
  );
};

export default ActivityCard;
