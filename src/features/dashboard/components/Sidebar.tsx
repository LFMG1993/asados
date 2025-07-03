// src/components/layout/Sidebar.tsx

import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
// ** Importa el nuevo icono deseado desde react-feather **
import { Home, ShoppingCart, Users, BarChart2, Truck } from 'react-feather'; // ** Importa Truck **

export function Sidebar() {
  return (
    <Nav className="flex-column pt-3">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard" end>
          <Home className="me-2" size={18} />
          Dashboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/products">
          <ShoppingCart className="me-2" size={18} />
          Productos
        </Nav.Link>
      </Nav.Item>
      {/* ** CAMBIO AQUÍ: Reemplaza ShoppingCart por el nuevo icono (ej. Truck) ** */}
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/suppliers">
          <Truck className="me-2" size={18} /> {/* ** Usa el nuevo componente de icono ** */}
          Proveedores
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/users">
          <Users className="me-2" size={18} />
          Usuarios
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/reports">
          <BarChart2 className="me-2" size={18} />
          Reportes
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
