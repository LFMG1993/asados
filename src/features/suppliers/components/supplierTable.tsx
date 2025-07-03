// src/features/suppliers/components/SupplierTable.tsx
// Este componente muestra una tabla de proveedores

import React from 'react';
// Importa componentes UI de react-bootstrap necesarios para la tabla
import { Table, Button } from 'react-bootstrap';

// ** Importa el tipo Supplier **
import type { Supplier } from '../../../types/supplier.types'; // ** VERIFICA ESTA RUTA ** (Desde components hasta types en la raíz)


// Define las propiedades que el componente SupplierTable espera recibir
interface SupplierTableProps {
    suppliers: Supplier[]; // La lista de proveedores a mostrar
    // Funciones de acción que se llamarán desde el componente padre
    onEdit: (supplier: Supplier) => void; // Función para manejar la edición
    onDelete: (supplierId: string, supplierName: string) => void; // Función para manejar la eliminación
    // Puedes pasar estados de loading/error/refresh si quieres que la tabla los maneje visualmente también
    // loading?: boolean;
    // error?: Error | null;
    // onRefresh?: () => void;
}

export function SupplierTable({ suppliers, onEdit, onDelete }: SupplierTableProps) {
    console.log("SupplierTable component is rendering with suppliers:", suppliers); // Log para depuración

    // No maneja loading/error/no-data messages si esos están en el padre (SuppliersFeature)
    // Si SuppliersFeature ya maneja esos casos y solo renderiza SupplierTable cuando hay datos,
    // entonces esta tabla asume que 'suppliers' es un arreglo (posiblemente vacío).

    return (
        // No necesita el contenedor principal o el título si el padre ya los proporciona
        <div className="container mt-4">

            {/* Renderiza la tabla de proveedores */}
            <Table striped bordered hover responsive className="mt-3">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Contacto</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Dirección</th>
                        <th>Notas</th>
                        <th>Creado En</th>
                        <th>Actualizado En</th>
                        <th>Acciones</th> {/* Columna para las acciones */}
                    </tr>
                </thead>
                <tbody>
                    {/* Mapea los proveedores recibidos como propiedad */}
                    {suppliers.map(supplier => (
                        <tr key={supplier.id}> {/* Usa el ID del proveedor como key */}
                            <td>{supplier.name}</td>
                            <td>{supplier.contactPerson || '-'}</td> {/* Muestra '-' si es vacío/nulo */}
                            <td>{supplier.phone || '-'}</td>
                            <td>{supplier.email || '-'}</td>
                            <td>{supplier.address || '-'}</td>
                            <td>{supplier.notes || '-'}</td>
                            {/* Formatea las fechas si existen */}
                            <td>{supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : '-'}</td>
                            <td>{supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleDateString() : '-'}</td>
                            <td>
                                {/* Botones de acción que llaman a las funciones pasadas como props */}
                                <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit(supplier)}>Editar</Button>
                                {/* Pasa el ID y el nombre a la función de eliminación */}
                                <Button variant="danger" size="sm" onClick={() => onDelete(supplier.id, supplier.name)}>Eliminar</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

        </div> // Cierra el contenedor si lo usas
    );
}
