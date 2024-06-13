import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/home/LandingPage';
import Navbar from '../components/navigation/Navbar';

export const PublicRoutes = () => {
  return (
    <main className="relative w-[100vw] flex flex-col items-center">
      <Navbar className='bg-transparent' />
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </main>
  );
};
