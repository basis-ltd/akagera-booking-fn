import { Routes, Route } from 'react-router-dom';
import CreateBookingActivities from '../pages/bookings/CreateBookingActivities.tsx';
import Navbar from '../components/navigation/Navbar';

const Router = () => {
  return (
    <main className="relative w-[100vw] flex flex-col items-center">
      <Navbar className="bg-white" />
      <section className="h-[90vh] w-[90%] mx-auto absolute top-[10vh]">
        <Routes>
          <Route
            path="/bookings/create"
            element={<CreateBookingActivities />}
          />
        </Routes>
      </section>
    </main>
  );
};

export default Router;
