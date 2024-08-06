export const calculateBehindTheScenesPrice = (
  numberOfAdults: number,
  numberOfChildren: number
): number => {
  const totalPeople = numberOfAdults + numberOfChildren;

  if (totalPeople < 8) {
    return 25 * numberOfAdults + 20 * numberOfChildren;
  } else if (totalPeople <= 14) {
    return 200;
  } else {
    const fullGroups = Math.floor((totalPeople - 14) / 8);
    const remainingPeople = (totalPeople - 14) % 8;

    let basePrice = 200 * (fullGroups + 1);

    if (remainingPeople > 0) {
      const remainingAdults = Math.min(numberOfAdults, remainingPeople);
      const remainingChildren = remainingPeople - remainingAdults;

      basePrice += 25 * remainingAdults + 20 * remainingChildren;
    }

    return basePrice;
  }
};
