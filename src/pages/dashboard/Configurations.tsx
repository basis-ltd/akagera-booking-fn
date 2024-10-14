import Loader from '@/components/inputs/Loader';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import Table from '@/components/table/Table';
import AdminLayout from '@/containers/AdminLayout';
import {
  useFetchSettings,
  useUsdRateColumns,
  useAdminEmailColumns,
} from '@/hooks/settings/settings.hooks';
import { Settings } from '@/types/models/settings.types';
import { ColumnDef } from '@tanstack/react-table';

const Configurations = () => {
  // FETCH SETTINGS
  const { settingsList, settingsIsFetching, settingsIsSuccess } =
    useFetchSettings();

  // NAVIGATION LINKS
  const navigationLinks = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Configurations',
      route: '/dashboard/configurations',
    },
  ];

  // USD RATE HISTORY COLUMNS
  const usdRateColumns = useUsdRateColumns();

  // ADMIN EMAIL HISTORY COLUMNS
  const adminEmailColumns = useAdminEmailColumns();

  return (
    <AdminLayout>
      <main className="h-full flex flex-col gap-8 p-6 w-[95%] mx-auto">
        <nav className="w-full flex items-start justify-start">
          <CustomBreadcrumb navigationLinks={navigationLinks} />
        </nav>
        <section className="w-full h-full flex flex-col gap-4">
          <h3 className="uppercase text-primary font-semibold text-lg text-start">
            Exchange rate
          </h3>
          {settingsIsFetching ? (
            <figure className="w-full min-h-[30vh] flex items-center justify-center">
              <Loader className="text-primary" />
            </figure>
          ) : (
            settingsIsSuccess && (
              <Table
                showExport={false}
                showPagination={false}
                showFilter={false}
                data={settingsList}
                columns={usdRateColumns as ColumnDef<Settings>[]}
              />
            )
          )}
        </section>

        <section className="w-full h-full flex flex-col gap-4">
          <h3 className="uppercase text-primary font-semibold text-lg text-statr">
            Admin Email
          </h3>

          {settingsIsFetching ? (
            <figure className="w-full min-h-[30vh] flex items-center justify-center">
              <Loader className="text-primary" />
            </figure>
          ) : (
            settingsIsSuccess && (
              <Table
                showExport={false}
                showPagination={false}
                showFilter={false}
                data={settingsList}
                columns={adminEmailColumns as ColumnDef<Settings>[]}
              />
            )
          )}
        </section>
      </main>
    </AdminLayout>
  );
};

export default Configurations;
