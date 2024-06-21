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
    if (pathname === '/auth/login' || pathname === '/auth/register') {
      setHideNavigation(true);
    } else {
      setHideNavigation(false);
    }
  }, [pathname]);

  return (
    <main className="w-[100vw] min-h-[90vh] relative">
      <PublicNavbar hideActions={hideNavigation} />
      <section className={`w-full h-full top-[10vh] absolute`}>
        {children}
      </section>
    </main>
  );
};

export default PublicLayout;
