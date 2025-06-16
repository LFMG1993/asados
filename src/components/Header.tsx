import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { LogOut, User as UserIcon } from 'react-feather';

export function Header() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="sticky-top p-0 shadow">
      <Navbar.Brand as={Link} to="/sales" className="col-md-3 col-lg-2 me-0 px-3">
        Proyecto Asados
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {/* Mostramos el link al Dashboard solo si el rol es 'admin' */}
          {role === 'admin' && (
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
          )}
        </Nav>
        <Nav className="ms-auto px-3">
          {user && (
            <NavDropdown title={<><UserIcon size={18} className="me-1" /> {user.name}</>} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleLogout}>
                <LogOut size={16} className="me-2" />
                Cerrar Sesión
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}