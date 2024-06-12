import { Routes, Route } from 'react-router-dom';
import CreateBooking from '../pages/bookings/CreateBooking';

const Router = () => {
  return (
    <main className='relative w-[100vw] p-6'>
      <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/bookings/create" element={<CreateBooking />} />
    </Routes>
    </main>
  );
};

export default Router;
