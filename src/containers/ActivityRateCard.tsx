import { Activity } from '@/types/models/activity.types';
import { ActivityRate } from '@/types/models/activityRate.types';

type ActivityRateCardProps = {
  activityRate: ActivityRate;
  activity: Activity | undefined;
};

const ActivityRateCard = ({
  activityRate,
  activity,
}: ActivityRateCardProps) => {
  return (
    <section>
      <h1>{activity?.name}</h1>
      <h1>{activityRate?.name}</h1>
    </section>
  );
};

export default ActivityRateCard;
