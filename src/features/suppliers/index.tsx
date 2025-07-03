// src/features/suppliers/components/SuppliersFeature.tsx
// Este componente será la vista principal para la gestión de proveedores

import React, { useState, useEffect } from 'react';
import { useSuppliers } from './hooks/useSuppliers'; // Asegúrate de la ruta correcta al hook
import { Spinner, Alert, Button } from 'react-bootstrap';
import { toast } from 'react-toastify'; // ** Asegúrate de que toast está importado **

// Importa el tipo Supplier
import type { Supplier } from '../../types/supplier.types'; // Asegúrate de la ruta correcta al tipo

// Importa los componentes de lista y modal (descomentados)
import { SupplierTable } from './components/supplierTable'; // Componente para mostrar la lista/tabla
import { SupplierFormModal } from './components/supplierFormModal'; // Componente para el modal/formulario


export function SuppliersFeature() {
  console.log("SuppliersFeature component is rendering");

  const { suppliers, loading, error, addSupplier, updateSupplier, deleteSupplier, refreshSuppliers } = useSuppliers();

  console.log("SuppliersFeature received from hook:", { suppliers, loading, error });

  // --- Estado para controlar el Modal de Añadir/Editar ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | undefined>(undefined);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);


  // --- Funciones para abrir y cerrar el modal (sin cambios) ---
  const handleShowAddModal = () => {
    setIsEditing(false);
    setCurrentSupplier(undefined);
    setShowModal(true);
  };

  const handleShowEditModal = (supplier: Supplier) => {
    setIsEditing(true);
    setCurrentSupplier(supplier);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentSupplier(undefined);
    setIsSubmittingModal(false);
  };

  // --- Función de envío del formulario en el modal (sin cambios) ---
  const handleFormSubmit = async (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'> | Partial<Omit<Supplier, 'createdAt'>>) => {
      // ... (código de handleFormSubmit sin cambios) ...
      console.log("SuppliersFeature: handleFormSubmit called with data:", supplierData);
      setIsSubmittingModal(true);
      try {
          if (isEditing && 'id' in supplierData && supplierData.id) {
               console.log(`SuppliersFeature: Calling updateSupplier hook function for ID: ${supplierData.id}`);
              await updateSupplier(supplierData.id, supplierData as Partial<Omit<Supplier, 'createdAt'>>);
              toast.success(`Proveedor "${(supplierData as any).name}" actualizado con éxito!`);
          } else {
               console.log("SuppliersFeature: Calling addSupplier hook function");
              await addSupplier(supplierData as Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>);
              toast.success(`Proveedor "${(supplierData as any).name}" añadido con éxito!`);
          }
          handleCloseModal();
      } catch (err: any) {
         console.error("SuppliersFeature: Error submitting supplier form:", err);
         toast.error(err.message || "Error al guardar proveedor");
         setIsSubmittingModal(false);
      }
  };

   // --- Función para manejar la eliminación con confirmación en Toastify ---
   // Esta función se llama desde el componente de lista/tabla (SupplierTable).
   const handleDeleteSupplier = async (supplierId: string, supplierName: string) => {
    console.log(`SuppliersFeature: handleDeleteSupplier called for ID: ${supplierId}, Name: ${supplierName}`);
     // Oculta cualquier toast anterior para evitar superposiciones o múltiples confirmaciones
     toast.dismiss();

     // ** Muestra un toast interactivo para pedir confirmación antes de eliminar **
     toast.warn( // Usamos toast.warn para un estilo de advertencia
       <div> {/* El contenido del toast es JSX */}
         <p className="mb-3">¿Estás seguro de que quieres eliminar al proveedor **{supplierName}**?</p> {/* Mensaje de confirmación */}
         {/* Botón para confirmar la eliminación */}
         <Button
           variant="danger" // Estilo rojo para peligro
           size="sm" // Tamaño pequeño del botón
           className="me-2" // Margen a la derecha para separar botones
           // ** Lógica de eliminación dentro del onClick del botón de confirmación **
           onClick={async () => {
             toast.dismiss(); // Cierra el toast de confirmación inmediatamente al hacer clic
             try {
               console.log(`SuppliersFeature: Calling deleteSupplier hook function for ID: ${supplierId}`);
               // Llama a la función deleteSupplier del hook para eliminar en la BD y actualizar el estado local
               await deleteSupplier(supplierId); // Llama a la función del hook
               console.log("SuppliersFeature: Supplier deleted via hook.");
               // Muestra una notificación de éxito después de la eliminación
               toast.success(`Proveedor "${supplierName}" eliminado con éxito!`);

             } catch (err: any) {
               console.error("SuppliersFeature: Error in deleteSupplier:", err);
               // Muestra una notificación de error si falla la eliminación
               toast.error(err.message || `Error al eliminar proveedor: ${supplierName}`);
             }
           }}
         >
           Sí, Eliminar
         </Button>
         {/* Botón para cancelar la eliminación */}
         <Button
           variant="secondary" // Estilo secundario
           size="sm"
           onClick={() => toast.dismiss()} // Simplemente cierra el toast al cancelar
         >
           Cancelar
         </Button>
       </div>,
       { // Opciones de configuración para el toast
         position: "top-center", // Posición del toast en la pantalla
         autoClose: false, // ** IMPORTANTE: No se cierra automáticamente, requiere interacción **
         closeButton: false, // Oculta el botón de cierre predeterminado
         hideProgressBar: true, // Oculta la barra de progreso
         draggable: false, // Evita que se pueda arrastrar el toast
         // className: 'custom-confirm-toast', // Opcional: agrega una clase para estilos personalizados
       }
     );
   };


  // Renderizado condicional para estados de carga y error del hook (sin cambios)
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando proveedores...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <Alert variant="danger">
          Error al cargar los proveedores: {error.message}
          <Button onClick={refreshSuppliers} className="ms-3" variant="outline-danger" size="sm">Reintentar</Button>
        </Alert>
      </div>
    );
  }


  // --- Renderizado principal de la vista ---
  return (
    <div className="container mt-4">
       <h2>Gestión de Proveedores</h2>

       {/* Botón para abrir el modal de añadir */}
       <Button onClick={handleShowAddModal} className="mb-3">Añadir Nuevo Proveedor</Button>

       {/* Muestra mensaje si no hay proveedores después de cargar */}
       {!loading && !error && (!suppliers || suppliers.length === 0) && (
         <Alert variant="info">
           No hay proveedores disponibles.
         </Alert>
       )}

       {/* Renderiza el componente de lista/tabla (SupplierTable) */}
       {!loading && !error && suppliers && suppliers.length > 0 && (
            <SupplierTable
              suppliers={suppliers}
              onEdit={handleShowEditModal} // Pasa la función para editar
              onDelete={handleDeleteSupplier} // ** Pasa la función de eliminación con toastify **
              // No pasamos loading/error/refresh
            />
       )}


       {/* Renderiza el componente del modal/formulario (SupplierFormModal) */}
       <SupplierFormModal
         show={showModal}
         onHide={handleCloseModal}
         onSubmit={handleFormSubmit}
         isEditing={isEditing}
         initialData={currentSupplier}
         isLoading={isSubmittingModal}
       />

    </div>
  );
}
