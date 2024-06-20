import { Routes, Route } from 'react-router-dom';
import CreateBookingActivities from '../pages/bookings/CreateBookingActivities.tsx';
import CreateBooking from '@/pages/bookings/CreateBooking.tsx';
import BookingPreview from '@/pages/bookings/BookingPreview.tsx';
import BookingSuccess from '@/pages/bookings/BookingSuccess.tsx';
import Login from '@/pages/auth/Login.tsx';
import LandingPage from '@/pages/home/LandingPage.tsx';
import ViewBookings from '@/pages/dashboard/ViewBookings.tsx';

const Router = () => {
  return (
    <section className="w-[100vw] mx-auto absolute">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/bookings/create" element={<CreateBookingActivities />} />
        <Route path="/bookings/:id/preview" element={<BookingPreview />} />
        <Route path="/bookings/:id/success" element={<BookingSuccess />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/dashboard/bookings" element={<ViewBookings />} />
      </Routes>
      <CreateBooking />
    </section>
  );
};

export default Router;
