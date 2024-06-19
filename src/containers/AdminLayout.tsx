import Navbar from '@/components/navigation/Navbar';
import Sidebar from '@/components/navigation/Sidebar';
import { RootState } from '@/states/store';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {

  // STATE VARIABLES
  const { isOpen: sidebarOpen } = useSelector((state: RootState) => state.sidebar);

  return (
    <main className="w-[100vw] relative">
      <Navbar />
      <Sidebar />
      <section
        className={`w-full h-full top-[10vh] absolute ${
          sidebarOpen ? 'w-[80vw] left-[20vw]' : 'w-[95vw] left-[5vw]'
        }`}
      >
        {children}
      </section>
    </main>
  );
};

export default AdminLayout;
