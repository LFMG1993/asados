import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { SalesPage } from './pages/SalesPage';
import { SupplersPage } from './pages/SupplersPage';

// Importa el componente ProductPage (o ProductManagementView/ProductTable si usas esos directamente)
// Ajusta la ruta de importación según la ubicación
import { ProductPage } from './pages/productPage'; // Asegúrate de que esta ruta es correcta y que ProductPage renderiza tu vista de productos

function DashboardHome() { return <div className="pt-3"><h2>Resumen del Dashboard</h2></div>; }
function UserManagement() { return <div className="pt-3"><h2>Gestión de Usuarios</h2></div>; }
function Reports() { return <div className="pt-3"><h2>Reportes de Ventas</h2></div>; }
function Unauthorized() { return <div className="d-flex align-items-center justify-content-center vh-100"><h1>🚫 Acceso Denegado</h1></div>; }

function App() {
  return (
    <>
      <ToastContainer position='bottom-right' theme='colored' />
      <Routes>
        {/* Ruta pública para el Login */}
        <Route path="/" element={<LoginPage />} />
        {/* Ruta para acceso no autorizado */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Grupo de rutas protegidas (requieren autenticación con roles específicos) */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'cajero', 'supervisor']} />}>
          {/* MainLayout envuelve las rutas de nivel superior protegidas */}
          <Route element={<MainLayout />}>

            {/* Ruta para la página de Ventas */}
            <Route path="/sales" element={<SalesPage />} />

            {/* Grupo de rutas protegidas adicionales (solo para admin) */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              {/* DashboardLayout envuelve las rutas del dashboard */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                {/* Ruta index del dashboard (ej. /dashboard) */}
                <Route index element={<DashboardHome />} />
                {/* Ruta para la gestión de productos (/dashboard/products) */}
                <Route path="products" element={<ProductPage />} />
                {/* Ruta para la gestión de usuarios (/dashboard/users) */}
                <Route path="users" element={<UserManagement />} />
                {/* Ruta para Reportes (/dashboard/reports) */}
                <Route path="reports" element={<Reports />} />

                {/* ** AÑADIR ESTA NUEVA RUTA PARA LA GESTIÓN DE PROVEEDORES ** */}
                {/* Esta ruta será '/dashboard/suppliers' */}
                <Route path="suppliers" element={<SupplersPage />} /> {/* ** INSERTA ESTA LÍNEA ** */}


              </Route> {/* Cierra DashboardLayout */}
            </Route> {/* Cierra ProtectedRoute para admin */}
          </Route> {/* Cierra MainLayout */}
        </Route> {/* Cierra ProtectedRoute principal */}


        {/* Ruta comodín para redirigir a la página de inicio de sesión si no hay ruta coincidente */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
