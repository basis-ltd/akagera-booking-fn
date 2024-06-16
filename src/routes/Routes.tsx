import { Routes, Route } from 'react-router-dom';
import CreateBookingActivities from '../pages/bookings/CreateBookingActivities.tsx';
import Navbar from '../components/navigation/Navbar';
import CreateBooking from '@/pages/bookings/CreateBooking.tsx';
import BookingPreview from '@/pages/bookings/BookingPreview.tsx';
import BookingSuccess from '@/pages/bookings/BookingSuccess.tsx';

const Router = () => {
  return (
    <main className="relative w-[100vw] flex flex-col items-center">
      <Navbar className="bg-white" />
      <section className="min-h-[90vh] w-[90%] mx-auto absolute top-[10vh] py-6">
        <Routes>
          <Route
            path="/bookings/create"
            element={<CreateBookingActivities />}
          />
          <Route path="/bookings/:id/preview" element={<BookingPreview />} />
          <Route path="/bookings/:id/success" element={<BookingSuccess />} />
        </Routes>
        <CreateBooking />
      </section>
    </main>
  );
};

export default Router;
