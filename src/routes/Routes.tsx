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
import UserProfile from '@/pages/users/UserProfile.tsx';
import PaymentModal from '@/containers/PaymentModal.tsx';
import PaymentSuccess from '@/pages/payments/PaymentSuccess.tsx';
import CreateActivity from '@/pages/activities/CreateActivity.tsx';
import BookingConsent from '@/pages/bookings/BookingConsent.tsx';
import TermsOfService from '@/pages/dashboard/terms-conditions/TermsOfService.tsx';
import AddBehindTheScencesActivity from '@/pages/bookings/booking-activities/AddBehindTheScencesActivity.tsx';
import AddBoatTripMorningDayActivity from '@/pages/bookings/booking-activities/AddBoatTripMorningDayActivity.tsx';
import AddCampingActivities from '@/pages/bookings/booking-activities/AddCampingActivities.tsx';
import AddGameDayDriveActivity from '@/pages/bookings/booking-activities/AddGameDayDriveActivity.tsx';
import AddBoatTripPrivateActivity from '@/pages/bookings/booking-activities/AddBoatTripPrivateActivity.tsx';
import CancellationPolicy from '@/pages/bookings/CancellationPolicy.tsx';
import SearchBookings from '@/pages/bookings/SearchBookings.tsx';
import SystemLogs from '@/pages/dashboard/SystemLogs.tsx';
import RequestResetPassword from '@/pages/auth/RequestResetPassword.tsx';
import VerifyPasswordReset from '@/pages/auth/VerifyPasswordReset.tsx';
import ResetPassword from '@/pages/auth/ResetPassword.tsx';
import AdminRoutes from '@/outlets/AdminRoutes.tsx';
import AuthenticatedRoutes from '@/outlets/AuthenticatedRoutes.tsx';
import Configurations from '@/pages/dashboard/Configurations.tsx';
import UpdateUsdRate from '@/pages/dashboard/UpdateUsdRate.tsx';
import UpdateAdminEmail from '@/pages/dashboard/UpdateAdminEmail.tsx';

const Router = () => {
  return (
    <section className="w-[100vw] mx-auto absolute">
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/**
         *
         * BOOKING ROUTES
         *
         */}
        <Route
          path="/bookings/:id/create"
          element={<CreateBookingActivities />}
        />
        <Route path="/bookings/:id/preview" element={<BookingPreview />} />
        <Route path="/bookings/:id/consent" element={<BookingConsent />} />
        <Route path="/bookings/:id/success" element={<BookingSuccess />} />
        <Route path="/bookings/search" element={<SearchBookings />} />
        <Route path="/payments/success" element={<PaymentSuccess />} />

        {/**
         *
         * AUTHENTICATION ROUTES
         *
         */}
        <Route
          path="/auth/request-reset-password"
          element={<RequestResetPassword />}
        />
        <Route
          path="/auth/verify-password-reset"
          element={<VerifyPasswordReset />}
        />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/verify" element={<VerifyAuthentication />} />

        {/**
         *
         *  AUTHENTICATED ROUTES
         *
         */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/dashboard/bookings/activities"
            element={<ViewBookingActivites />}
          />
          <Route path="/dashboard/bookings" element={<ViewBookings />} />
          <Route
            path="/dashboard/registrations"
            element={<ViewRegistrations />}
          />
          <Route path="/bookings/:id/details" element={<BookingDetails />} />
          <Route path="/user/profile" element={<UserProfile />} />

          {/**
           *
           *  ADMIN ROUTES
           *
           */}
          <Route element={<AdminRoutes />}>
            <Route path="/admin/users" element={<ListUsers />} />
            <Route
              path="/dashboard/terms-of-services"
              element={<TermsOfService />}
            />
            <Route
              path="/dashboard/configurations"
              element={<Configurations />}
            />
          </Route>
          <Route path="/dashboard/logs" element={<SystemLogs />} />
          <Route path="/dashboard/users" element={<ListUsers />} />
          <Route path="/dashboard/activities" element={<ListActivities />} />
          <Route
            path="/dashboard/activities/:id"
            element={<ActivityDetails />}
          />
        </Route>
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
      <PaymentModal />
      <CreateActivity />
      <UpdateUsdRate />
      <UpdateAdminEmail />

      {/* ACTIVITIES */}
      <AddBehindTheScencesActivity />
      <AddBoatTripMorningDayActivity />
      <AddCampingActivities />
      <AddGameDayDriveActivity />
      <AddBoatTripPrivateActivity />

      {/* CANCELLATION POLICY */}
      <CancellationPolicy />
    </section>
  );
};

export default Router;
