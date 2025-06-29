import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { SalesPage } from './pages/SalesPage';

// Importa el componente ProductTable
// Ajusta la ruta de importación según la ubicación de tu archivo ProductTable.tsx
// Si usas un archivo index.ts, la ruta podría ser './features/sales/components'
import { ProductPage } from './pages/productPage';

function DashboardHome() { return <div className="pt-3"><h2>Resumen del Dashboard</h2></div>; }
// Puedes eliminar esta función si ya no la necesitas
// function ProductManagement() { return <div className="pt-3"><h2>Gestión de Productos</h2></div>; }
function UserManagement() { return <div className="pt-3"><h2>Gestión de Usuarios</h2></div>; }
function Reports() { return <div className="pt-3"><h2>Reportes de Ventas</h2></div>; }
function Unauthorized() { return <div className="d-flex align-items-center justify-content-center vh-100"><h1>🚫 Acceso Denegado</h1></div>; }

function App() {
  return (
    <>
      <ToastContainer position='bottom-right' theme='colored' />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route element={<ProtectedRoute allowedRoles={['admin', 'cajero', 'supervisor']} />}>
          <Route element={<MainLayout />}>
            <Route path="/sales" element={<SalesPage />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="products" element={<ProductPage />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="reports" element={<Reports />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
