import PublicNavbar from '@/components/navigation/PublicNavbar';
import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type PublicLayoutProps = {
  children: ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {
  // STATE VARIABLES
  const [hideNavigation, setHideNavigation] = useState<boolean>(false);

  // NAVIGATION
  const { pathname } = useLocation();

  useEffect(() => {
    setHideNavigation(
      pathname === '/auth/login' || pathname === '/auth/register'
    );
  }, [pathname]);

  return (
    <main className="w-full min-h-[90vh] flex flex-col relative">
      <PublicNavbar hideActions={hideNavigation} />
      <section className={`w-full flex-grow pt-[10vh]`}>{children}</section>
    </main>
  );
};

export default PublicLayout;
