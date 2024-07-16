import { Routes, Route } from 'react-router-dom';
import CreateBookingActivities from '../pages/bookings/CreateBookingActivities.tsx';
import CreateBooking from '@/pages/bookings/CreateBooking.tsx';
import BookingPreview from '@/pages/bookings/BookingPreview.tsx';
import BookingSuccess from '@/pages/bookings/BookingSuccess.tsx';
import Login from '@/pages/auth/Login.tsx';
import LandingPage from '@/pages/home/LandingPage.tsx';
import ViewBookings from '@/pages/dashboard/ViewBookings.tsx';
import CreateBookingPerson from '@/pages/bookings/CreateBookingPerson.tsx';
import CreateBookingVehicle from '@/pages/bookings/CreateBookingVehicle.tsx';
import DeleteBookingPerson from '@/pages/bookings/DeleteBookingPerson.tsx';
import DeleteBookingVehicle from '@/pages/bookings/DeleteBookingVehicle.tsx';
import DeleteBookingActivity from '@/pages/bookings/DeleteBookingActivity.tsx';
import ViewRegistrations from '@/pages/dashboard/ViewRegistrations.tsx';
import BookingDetails from '@/pages/bookings/BookingDetails.tsx';
import ListUsers from '@/pages/users/ListUsers.tsx';
import CreateUser from '@/pages/users/CreateUser.tsx';
import ListActivities from '@/pages/activities/ListActivities.tsx';
import ActivityDetails from '@/pages/activities/ActivityDetails.tsx';
import UpdateActivity from '@/pages/activities/UpdateActivity.tsx';
import DeleteActivity from '@/pages/activities/DeleteActivity.tsx';
import Dashboard from '@/pages/dashboard/Dashboard.tsx';
import ViewBookingActivites from '@/pages/dashboard/ViewBookingActivites.tsx';
import GenerateReport from '@/pages/dashboard/GenerateReport.tsx';
import ActivityScheduleDetails from '@/pages/activitySchedules/ActivityScheduleDetails.tsx';
import CreateActivitySchedule from '@/pages/activitySchedules/CreateActivitySchedule.tsx';
import DeleteActivitySchedule from '@/pages/activitySchedules/DeleteActivitySchedule.tsx';
import CreateActivityRate from '@/pages/activityRates/CreateActivityRate.tsx';
import DeleteActivityRate from '@/pages/activityRates/DeleteActivityRate.tsx';
import UpdateActivityRate from '@/pages/activityRates/UpdateActivityRate.tsx';
import VerifyAuthentication from '@/pages/auth/VerifyAuthentication.tsx';

const Router = () => {
  return (
    <section className="w-[100vw] mx-auto absolute">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/bookings/:id/create"
          element={<CreateBookingActivities />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/dashboard/bookings/activities"
          element={<ViewBookingActivites />}
        />
        <Route path="/bookings/:id/preview" element={<BookingPreview />} />
        <Route path="/bookings/:id/details" element={<BookingDetails />} />
        <Route path="/bookings/:id/success" element={<BookingSuccess />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify" element={<VerifyAuthentication />} />
        <Route path="/dashboard/bookings" element={<ViewBookings />} />
        <Route
          path="/dashboard/registrations"
          element={<ViewRegistrations />}
        />
        <Route path="/dashboard/users" element={<ListUsers />} />
        <Route path="/dashboard/activities" element={<ListActivities />} />
        <Route path="/dashboard/activities/:id" element={<ActivityDetails />} />
      </Routes>
      <CreateBooking />
      <CreateBookingPerson />
      <CreateBookingVehicle />
      <DeleteBookingPerson />
      <DeleteBookingVehicle />
      <DeleteBookingActivity />
      <CreateUser />
      <UpdateActivity />
      <DeleteActivity />
      <GenerateReport />
      <ActivityScheduleDetails />
      <CreateActivitySchedule />
      <DeleteActivitySchedule />
      <CreateActivityRate />
      <DeleteActivityRate />
      <UpdateActivityRate />
    </section>
  );
};

export default Router;
