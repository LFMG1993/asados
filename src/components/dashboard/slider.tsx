import {useLogout} from "../../hooks/useLogout";
import React from 'react'; // Importa React

// Define las props del componente, incluyendo children
interface SliderBarProps {
    children: React.ReactNode; // Define que puede recibir cualquier contenido de React como hijos
}

export function SliderBar({ children }: SliderBarProps) { // Destructura children de las props
    const handleLogout = useLogout();
    return ( 
        <>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">Asados</a>
                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="عرض/إخفاء لوحة التنقل">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <input className="form-control form-control-dark w-100" type="text" placeholder="Buscar" aria-label="Buscar en el panel" />
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
                        <a className="nav-link px-3" href="#" onClick={handleLogout}>Cerrar Sesión</a>
                    </div>
                </div>
            </header>

            {/* Contenedor principal con la fila y las columnas */}
            <div className="container-fluid">
                <div className="row"> {/* Elimina justify-content-end de la fila principal */}
                    <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                        <div className="position-sticky pt-3">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/Home">
                                        <span data-feather="home"></span>
                                        Inicio
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="file"></span>
                                        Solicitudes
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="shopping-cart"></span>
                                        Productos
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="users"></span>
                                        Clientes
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="bar-chart-2"></span>
                                        Informes
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="layers"></span>
                                        Integrales
                                    </a>
                                </li>
                            </ul>

                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                                <span> Informes Guardados</span>
                                <a className="link-secondary" href="#" aria-label="إضافة تقرير جديد">
                                    <span data-feather="plus-circle"></span>
                                </a>
                            </h6>
                            <ul className="nav flex-column mb-2">
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="file-text"></span>
                                        Este mes
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="file-text"></span>
                                        Ultimo Trimestre
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="file-text"></span>
                                        Interacción Social
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">
                                        <span data-feather="file-text" />
                                        Ventas de fin de año
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Área para el contenido principal (donde se renderizarán los children) */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                        {children} {/* Aquí se renderizará el contenido que le pases a SliderBar */}
                    </main>
                </div>
            </div>
        </>
    );
}

export default SliderBar;