import Button from '../components/inputs/Button';
import { Activity } from '../types/models/activity.types';

type ActivityCardProps = {
  activity: Activity;
};

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <section className="flex flex-col items-center w-full max-w-[24%] p-4 rounded-lg shadow-md">
      <h1 className="text-primary font-medium text-lg mb-4">{activity.name}</h1>
      <p className="text-center text-sm text-gray-500 mt-2">
        {activity?.description}
      </p>
      <p className="text-primary text-sm font-bold">$65</p>
      <Button styled={false}>Select</Button>
    </section>
  );
};

export default ActivityCard;
