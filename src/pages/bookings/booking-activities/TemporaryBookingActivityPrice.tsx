import { calculateActivityPrice } from '@/helpers/booking.helper';
import { formatCurrency } from '@/helpers/strings.helper';
import { RootState } from '@/states/store';
import { BookingActivity } from '@/types/models/bookingActivity.types';
import { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface TemporaryBookingActivityPriceProps {
  defaultRate?: number;
  disclaimer?: string | ReactNode;
  numberOfAdults?: number;
  numberOfChildren?: number;
  numberOfSeats?: number;
}

const TemporaryBookingActivityPrice = ({
  defaultRate,
  disclaimer,
  numberOfAdults,
  numberOfChildren,
  numberOfSeats,
}: TemporaryBookingActivityPriceProps) => {
  // STATE VARIABLES
  const { selectedActivity } = useSelector(
    (state: RootState) => state.activity
  );
  const [estimatedPrice, setEstimatedPrice] = useState<number>(
    defaultRate || 0
  );

  useEffect(() => {
    const tempPrice = calculateActivityPrice({
      numberOfAdults: numberOfAdults ? Number(numberOfAdults) : 0,
      numberOfChildren: numberOfChildren ? Number(numberOfChildren) : 0,
      numberOfSeats: numberOfSeats ? Number(numberOfSeats) : 0,
      defaultRate: defaultRate ? Number(defaultRate) : 0,
      activity: selectedActivity,
    } as BookingActivity);

    if (!isNaN(tempPrice)) {
      setEstimatedPrice(tempPrice);
    }
  }, [
    defaultRate,
    numberOfAdults,
    numberOfChildren,
    numberOfSeats,
    selectedActivity,
  ]);

  return (
    <article
      className="w-full p-2 rounded-md shadow-md flex flex-col items-start"
      aria-label="Booking price information"
    >
      {!isNaN(estimatedPrice) && (
        <section className="mb-2">
          <p className="text-md font-normal text-[15px] text-primary flex items-center gap-1">
            Total Cost:
            <span className="text-md font-medium text-primary">
              {formatCurrency(Number(estimatedPrice.toFixed(2)))}
            </span>
          </p>
        </section>
      )}
      {disclaimer && (
        <section className='w-full flex flex-col gap-2'>
          <p className="text-sm text-gray-600 w-full" aria-live="polite">
            {disclaimer}
          </p>
        </section>
      )}
    </article>
  );
};

export default TemporaryBookingActivityPrice;
