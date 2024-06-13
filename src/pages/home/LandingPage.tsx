import { Link } from 'react-router-dom';
import CreateBooking from '../bookings/CreateBooking';
import { AppDispatch } from '../../states/store';
import { useDispatch } from 'react-redux';
import { setCreateBookingModal } from '../../states/features/bookingSlice';

const LandingPage = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();

  return (
    <main className="p-0 m-0 flex flex-col gap-0 w-full text-white">
      <figure className="hero-section w-full h-[100vh] flex flex-col items-start justify-center">
        <section className="w-[85%] mx-auto flex flex-col gap-4">
          <article className="w-full mx-auto flex flex-col gap-5 text-white">
            <h1 className="font-semibold text-[60px]">Agakera National Park</h1>
            <p className="font-medium text-xl">
              Akagera lies on the eastern border of Rwanda, making it easy to
              visit and admire the wildlife – from lion to rhino – that thrives
              in this beautiful savannah and wetland.
            </p>
          </article>
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
        </section>
      </figure>
      <CreateBooking />
    </main>
  );
};

export default LandingPage;
