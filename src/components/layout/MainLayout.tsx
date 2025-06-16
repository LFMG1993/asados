import { Outlet } from 'react-router-dom';
import { Header } from '../Header';

export function MainLayout() {
  return (
    <>
      <Header />
      {/* El <Outlet> renderizará aquí la página hija: SalesPage, DashboardLayout, etc. */}
      <Outlet />
    </>
  );
}