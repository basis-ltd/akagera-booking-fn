import store from 'store';
import { RootState } from '@/states/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminRoutes = () => {
  // STATE VARIABLES
  const { user } = useSelector((state: RootState) => state.user);

  // NAVIGATION
  const navigate = useNavigate();

  useEffect(() => {
    if (!['admin', 'super-admin'].includes(String(user?.role))) {
      store.clearAll();
      navigate('/auth/login');
    }
  }, [user, navigate]);

  return <Outlet />;
};

export default AdminRoutes;
