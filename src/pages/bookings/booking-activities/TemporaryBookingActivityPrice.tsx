import { formatCurrency } from "@/helpers/strings.helper";

interface TemporaryBookingActivityPriceProps {
  defaultRate?: number;
  disclaimer?: string;
  bookingActivity?: {
    numberOfSeats?: number;
    numberOfAdults: number;
    numberOfChildren?: number;
    startTime?: Date;
    endTime?: Date;
  };
}

const TemporaryBookingActivityPrice = ({
  defaultRate,
  disclaimer,
}: TemporaryBookingActivityPriceProps) => {
  return (
    <aside
      className="w-full p-2 rounded-md shadow-md flex flex-col items-start"
      aria-label="Booking price information"
    >
      {defaultRate && (
        <section className="mb-2">
          <p className="text-md font-normal text-primary">
            Total Price:
            <span className="ml-2 text-md font-medium text-primary">
              {formatCurrency(defaultRate.toFixed(2))}
            </span>
          </p>
        </section>
      )}
      {disclaimer && (
        <section>
          <p className="text-sm text-gray-600" aria-live="polite">
            {disclaimer}
          </p>
        </section>
      )}
    </aside>
  );
};

export default TemporaryBookingActivityPrice;
