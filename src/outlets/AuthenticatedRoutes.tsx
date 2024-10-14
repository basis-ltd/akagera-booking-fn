import store from 'store';
import { RootState } from '@/states/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthenticatedRoutes = () => {
  // STATE VARIABLES
  const { user, token } = useSelector((state: RootState) => state.user);

  // NAVIGATION
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      store.clearAll();
      navigate('/auth/login');
    }
  }, [user, token, navigate]);

  return <Outlet />;
};

export default AuthenticatedRoutes;
