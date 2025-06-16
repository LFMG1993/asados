import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Sidebar } from '../../features/dashboard/components/Sidebar';

export function DashboardLayout() {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <Sidebar />
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {/* Aquí se renderizarán las páginas hijas del dashboard */}
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}