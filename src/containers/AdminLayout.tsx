import Navbar from '@/components/navigation/Navbar';
import Sidebar from '@/components/navigation/Sidebar';
import { RootState } from '@/states/store';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isOpen: sidebarOpen } = useSelector(
    (state: RootState) => state.sidebar
  );

  return (
    <main className="w-full min-h-screen flex flex-col overflow-y-scroll">
      <Navbar />

      <section className="flex relative flex-1 top-[10vh] w-full">
        <Sidebar />
        <section
          className={`absolute flex-1 transition-all duration-300 ease-in-out w-full ${
            sidebarOpen
              ? 'left-[40vw] w-[60vw] md:left-[25vw] md:w-[75vw] lg:left-[20vw] lg:w-[80vw]'
              : 'left-[5vw] w-[95vw] md:left-[5vw] md:w-[95vw]'
          } p-4`}
        >
          {children}
        </section>
      </section>
    </main>
  );
};

export default AdminLayout;
