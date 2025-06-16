import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Users, BarChart2 } from 'react-feather';

export function Sidebar() {
  // NavLink de react-router-dom se encargará de la clase 'active' automáticamente
  return (
    <Nav className="flex-column pt-3">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard" end>
          <Home className="me-2" size={18}/>
          Dashboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/products">
          <ShoppingCart className="me-2" size={18}/>
          Productos
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/users">
          <Users className="me-2" size={18}/>
          Usuarios
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/dashboard/reports">
          <BarChart2 className="me-2" size={18}/>
          Reportes
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}