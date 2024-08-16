import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import {
  setBooking,
  setCreateBookingModal,
  setDraftBookingsModal,
} from '../../states/features/bookingSlice';
import ListDraftBookings from '../bookings/ListDraftBookings';
import PublicLayout from '@/containers/PublicLayout';
import { useEffect } from 'react';
import LandingPageCard from '@/components/cards/LandingPageCard';

const LandingPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // SET DOCUMENT TITLE
  useEffect(() => {
    document.title = 'Akagera National Park';
  }, []);

  return (
    <PublicLayout>
      <main className="p-0 m-0 flex flex-col gap-0 w-full bg-background">
        <section className="w-full mx-auto flex flex-col gap-8 min-h-[90vh] justify-center">
          <article className="w-full flex flex-col gap-3 items-center">
            <h1 className="text-center text-3xl font-bold text-black">
              Welcome to{' '}
              <span className="text-primary text-3xl">
                Akagera Booking Platform
              </span>
              .
            </h1>
            <p className="text-center">
              Choose one of the options below to get started!
            </p>
          </article>
          <ul className="grid grid-cols-3 gap-10 my-5 items-center w-[80%] mx-auto">
            <LandingPageCard
              title="Book activities"
              description="Register for park visit and book your favorite activities ahead of time"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setBooking({
                    type: 'booking',
                  })
                );
                dispatch(setCreateBookingModal(true));
              }}
            />
            <LandingPageCard
              title="Complete registration"
              description="Register for a visit into the park and select your favorite activities on arrival."
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setBooking({
                    type: 'registration',
                  })
                );
                dispatch(setCreateBookingModal(true));
              }}
            />
            <LandingPageCard
              onClick={(e) => {
                e.preventDefault();
                dispatch(setDraftBookingsModal(true));
              }}
              title="Find bookings/registrations"
              description="Find a list of all your bookings, including the unfinished."
            />
          </ul>
        </section>
        <ListDraftBookings />
      </main>
    </PublicLayout>
  );
};

export default LandingPage;
