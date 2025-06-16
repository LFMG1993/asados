import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    // Mientras se verifica el usuario, podemos mostrar un spinner o una pantalla de carga
    return <div>Verificando acceso...</div>;
  }

  if (!user) {
    // Si no hay usuario, redirigir al login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role!)) {
    // --- LÍNEA CORREGIDA ---
    // Verificamos si el rol está en un array de roles que deben ir a /sales
    const shouldRedirectToSales = ['cajero', 'admin'].includes(role!);
    const redirectPath = shouldRedirectToSales ? '/sales' : '/unauthorized';
    
    return <Navigate to={redirectPath} replace />;
  }
  
  // Si todo está en orden, renderizamos la ruta solicitada
  return <Outlet />;
}