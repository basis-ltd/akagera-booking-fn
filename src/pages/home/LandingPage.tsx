import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import {
  setBooking,
  setCreateBookingModal,
  setGetBookingEmailModal,
} from '../../states/features/bookingSlice';
import GetBookingEmail from '../bookings/GetBookingEmail';
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
      <main className="hero-section p-0 m-0 flex flex-col gap-0 w-full bg-background">
        <section className="w-full mx-auto flex flex-col gap-8 min-h-[65vh] justify-center">
          <article className="w-full flex flex-col gap-3 items-center">
            <h1 className="text-center text-3xl font-bold text-white">
              Welcome to{' '}
              <span className="text-white text-3xl">
                Akagera Booking Platform
              </span>
              .
            </h1>
            <p className="text-center">
              Choose one of the options below to get started!
            </p>
          </article>
          <ul className="grid grid-cols-3 gap-10 my-5 items-center justify-center mx-auto w-[80%] max-[1200px]:w-[85%] max-[1100px]:w-[90%] max-[1000px]:w-[95%] max-[800px]:grid-cols-2 max-[600px]:grid-cols-1">
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
                dispatch(setGetBookingEmailModal(true));
              }}
              title="Find bookings/registrations"
              description="Find a list of all your bookings, including the unfinished."
            />
          </ul>
        </section>
        <GetBookingEmail />
      </main>
    </PublicLayout>
  );
};

export default LandingPage;
