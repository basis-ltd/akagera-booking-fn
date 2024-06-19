import PublicNavbar from '@/components/navigation/PublicNavbar';
import { ReactNode } from 'react';

type PublicLayoutProps = {
  children: ReactNode;
};

const PublicLayout = ({ children }: PublicLayoutProps) => {

  return (
    <main className="w-[100vw] relative">
      <PublicNavbar />
      <section
        className={`w-full h-full top-[10vh] absolute`}
      >
        {children}
      </section>
    </main>
  );
};

export default PublicLayout;
