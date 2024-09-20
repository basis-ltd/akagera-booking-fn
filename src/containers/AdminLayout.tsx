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
    <main className="w-full h-screen flex flex-col overflow-y-scroll">
      <Navbar />

      <section className="flex flex-1 absolute top-[10vh] w-full">
        <Sidebar />

        <section
          className={`relative flex-1 transition-all duration-300 ease-in-out w-full ${
            sidebarOpen
              ? 'ml-[20vw] md:ml-[25vw] lg:ml-[20vw]'
              : 'ml-[70px] md:ml-[70px]'
          } p-4`}
        >
          {children}
        </section>
      </section>
    </main>
  );
};

export default AdminLayout;
