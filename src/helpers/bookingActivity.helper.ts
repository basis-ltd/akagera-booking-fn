export const calculateBehindTheScenesPrice = ({
  numberOfAdults,
  numberOfChildren
}: {
  numberOfAdults: number;
  numberOfChildren: number;
}): number => {
  const totalPeople = numberOfAdults + numberOfChildren;
  const ADULT_RATE = 25;
  const CHILD_RATE = 15;
  const GROUP_RATE = 180;
  const GROUP_SIZE = 14;

  if (totalPeople < 4) {
    return 100;
  }

  if (totalPeople < 8) {
    return ADULT_RATE * numberOfAdults + CHILD_RATE * numberOfChildren;
  }

  if (totalPeople <= GROUP_SIZE) {
    return GROUP_RATE;
  }

  const fullGroups = Math.floor(totalPeople / GROUP_SIZE);
  const remainingPeople = totalPeople % GROUP_SIZE;

  let totalCost = fullGroups * GROUP_RATE;

  if (remainingPeople >= 8) {
    totalCost += GROUP_RATE;
  } else if (remainingPeople > 0) {
    const adultsInFullGroups = Math.min(
      numberOfAdults,
      fullGroups * GROUP_SIZE
    );
    const childrenInFullGroups = Math.min(
      numberOfChildren,
      fullGroups * GROUP_SIZE - adultsInFullGroups
    );

    const remainingAdults = numberOfAdults - adultsInFullGroups;
    const remainingChildren = numberOfChildren - childrenInFullGroups;

    totalCost += ADULT_RATE * remainingAdults + CHILD_RATE * remainingChildren;
  }

  return totalCost;
};
