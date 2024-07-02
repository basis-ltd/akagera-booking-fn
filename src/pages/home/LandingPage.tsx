import { Link } from 'react-router-dom';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import {
  setBooking,
  setCreateBookingModal,
  setDraftBookingsModal,
} from '../../states/features/bookingSlice';
import Button from '@/components/inputs/Button';
import ListDraftBookings from '../bookings/ListDraftBookings';
import PublicLayout from '@/containers/PublicLayout';
import { useEffect } from 'react';

const LandingPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  // SET DOCUMENT TITLE
  useEffect(() => {
    document.title = 'Akagera National Park';
  }, []);

  return (
    <PublicLayout>
      <main className="p-0 m-0 flex flex-col gap-0 w-full text-white">
        <figure className="hero-section w-full h-[90vh] flex flex-col items-start justify-center">
          <section className="w-[85%] mx-auto flex flex-col gap-4">
            <article className="w-full mx-auto flex flex-col gap-4 text-white">
              <h1 className="font-semibold text-[60px] max-[1000px]:text-[50px] max-[900px]:text-[45px] max-[800px]:text-[40px] max-[600px]:text-[35px]">
                Akagera National Park
              </h1>
              <p className="font-medium text-xl max-[1000px]:text-[18px] max-[900px]:text-[17px] max-[800px]:text-[16px] max-[600px]:text-[15px]">
                Akagera lies on the eastern border of Rwanda, making it easy to
                visit and admire the wildlife – from lion to rhino – that
                thrives in this beautiful savannah and wetland.
              </p>
            </article>
            <menu className="w-full flex flex-col gap-2 items-center my-4">
              <ul className="flex gap-3 flex-col items-center">
                <Link
                  to={'/bookings/create'}
                  className="bg-white text-black p-2 px-4 w-fit rounded-md transition-all ease-in-out duration-300 hover:scale-[1.02]"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      setBooking({
                        type: 'booking',
                      })
                    );
                    dispatch(setCreateBookingModal(true));
                  }}
                >
                  Book activities
                </Link>
                <Link
                  to={'/bookings/create'}
                  className="bg-white text-black p-2 px-4 w-fit rounded-md transition-all ease-in-out duration-300 hover:scale-[1.02]"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      setBooking({
                        type: 'registration',
                      })
                    );
                    dispatch(setCreateBookingModal(true));
                  }}
                >
                  Complete the registration form
                </Link>
              </ul>
              <Button
                styled={false}
                className="text-white hover:!text-white hover:underline hover:!scale-[1]"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setDraftBookingsModal(true));
                }}
              >
                Complete existing booking/registration
              </Button>
            </menu>
          </section>
        </figure>
        <ListDraftBookings />
      </main>
    </PublicLayout>
  );
};

export default LandingPage;
