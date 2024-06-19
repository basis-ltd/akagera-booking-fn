import { Link } from 'react-router-dom';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import {
  setCreateBookingModal,
  setDraftBookingsModal,
} from '../../states/features/bookingSlice';
import Button from '@/components/inputs/Button';
import ListDraftBookings from '../bookings/ListDraftBookings';
import PublicLayout from '@/containers/PublicLayout';

const LandingPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <PublicLayout>
      <main className="p-0 m-0 flex flex-col gap-0 w-full text-white">
      <figure className="hero-section w-full h-[90vh] flex flex-col items-start justify-center">
        <section className="w-[85%] mx-auto flex flex-col gap-4">
          <article className="w-full mx-auto flex flex-col gap-5 text-white">
            <h1 className="font-semibold text-[60px]">Akagera National Park</h1>
            <p className="font-medium text-xl">
              Akagera lies on the eastern border of Rwanda, making it easy to
              visit and admire the wildlife – from lion to rhino – that thrives
              in this beautiful savannah and wetland.
            </p>
          </article>
          <menu className="w-full flex flex-col gap-2">
            <Link
              to={'/bookings/create'}
              className="bg-white text-black p-3 px-4 w-fit min-w-[15vw] mx-auto rounded-md transition-all ease-in-out duration-300 hover:scale-[1.02]"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setCreateBookingModal(true));
              }}
            >
              Book a tour
            </Link>
            <Button
              styled={false}
              className="text-white hover:!text-white hover:underline hover:!scale-[1]"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setDraftBookingsModal(true));
              }}
            >
              Complete existing booking
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
