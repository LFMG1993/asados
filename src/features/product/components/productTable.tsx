// src/features/sales/components/ProductManagementView.tsx

import React, { useEffect, useCallback, useState } from 'react'; // Importa useState
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import type { Product, ProductVariant } from '../../../types';
import { useProducts } from '../hooks/useProducts';
import { toast } from 'react-toastify';

// Importa el nuevo componente del modal
import { ProductFormModal } from './productFormModal';

export function ProductManagementView() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct, refreshProducts } = useProducts();

  // --- Estado para controlar el Modal ---
  const [showModal, setShowModal] = useState(false); // Controla si el modal está visible
  const [isEditing, setIsEditing] = useState(false); // Controla si el modal es para editar o añadir
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined); // Almacena el producto a editar

  // --- Funciones para abrir y cerrar el modal ---
  const handleShowAddModal = () => {
    setIsEditing(false); // Es para añadir
    setCurrentProduct(undefined); // Asegura que no hay datos iniciales de edición
    setShowModal(true); // Abre el modal
  };

  const handleShowEditModal = (product: Product) => {
    setIsEditing(true); // Es para editar
    setCurrentProduct(product); // Establece el producto a editar
    setShowModal(true); // Abre el modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Cierra el modal
    setIsEditing(false); // Reinicia el estado de edición
    setCurrentProduct(undefined); // Limpia el producto a editar
  };

  // --- Función de envío del formulario en el modal (llamada desde ProductFormModal) ---
  const handleFormSubmit = async (productData: Omit<Product, 'id'> | Partial<Product>) => {
      // Aquí es donde se decide si llamar a addProduct o updateProduct del hook
      try {
          if (isEditing && 'id' in productData && productData.id) {
              // Si estamos editando y tenemos el ID, llamamos a updateProduct
              await updateProduct(productData.id, productData);
              toast.success(`Producto "${productData.name}" actualizado con éxito!`);
          } else {
              // Si no estamos editando, llamamos a addProduct
              await addProduct(productData as Omit<Product, 'id'>); // Casteamos porque addProduct espera Omit
              toast.success(`Producto "${productData.name}" añadido con éxito!`);
          }
          handleCloseModal(); // Cierra el modal después del éxito
      } catch (err: any) {
         console.error("Error submitting product form:", err);
         // El error ya se maneja en el hook y potencialmente muestra un toast allí.
         // Pero podrías agregar lógica adicional aquí si es necesario.
      }
  };


  // ... (handleDeleteClick sin cambios significativos en su lógica interna)
   const handleDeleteClick = async (productId: string, productName: string) => {
    // ... (lógica de confirmación con toastify sin cambios)
     toast.dismiss(); // Oculta cualquier toast anterior

     toast.warn(
       <div>
         <p className="mb-3">¿Estás seguro de que quieres eliminar el producto **{productName}**?</p>
         <Button
           variant="danger"
           size="sm"
           className="me-2"
           onClick={async () => {
             toast.dismiss();
             try {
               await deleteProduct(productId);
               console.log("Producto eliminado:", productId);
               toast.success(`Producto "${productName}" eliminado con éxito!`);
             } catch (err: any) {
               console.error("Error al eliminar producto:", err);
               toast.error(`Error al eliminar producto: ${err.message}`);
             }
           }}
         >
           Sí, Eliminar
         </Button>
         <Button
           variant="secondary"
           size="sm"
           onClick={() => toast.dismiss()}
         >
           Cancelar
         </Button>
       </div>,
       {
         position: "top-center",
         autoClose: false,
         closeButton: false,
         hideProgressBar: true,
         draggable: false,
       }
     );
   };


  // ... (useEffect para error de carga inicial)

  // --- Renderizado ---

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5">
        <Alert variant="danger">
          Error al cargar los productos: {error.message}
          <Button onClick={refreshProducts} className="ms-3" variant="outline-danger" size="sm">Reintentar</Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4">
       <h2>Gestión de Productos</h2>

       {/* Botón para abrir el modal de añadir */}
       <Button onClick={handleShowAddModal} className="mb-3">Añadir Nuevo Producto</Button>

       {/* Muestra mensaje si no hay productos */}
       {!loading && !error && (!products || products.length === 0) && (
         <Alert variant="info">
           No hay productos disponibles.
         </Alert>
       )}

       {/* Renderiza la tabla si hay productos */}
       {!loading && !error && products && products.length > 0 && (
           <Table striped bordered hover responsive className="mt-3">
               <thead>
                   <tr>
                       <th>#</th>
                       <th>Nombre</th>
                       <th>Descripción</th>
                       <th>Variantes</th>
                       <th>Acciones</th>
                   </tr>
               </thead>
               <tbody>
                   {products.map((product, index) => (
                       <tr key={product.id}>
                           <td>{index + 1}</td>
                           <td>{product.name}</td>
                           <td>{product.description || 'Sin descripción'}</td>
                           <td>
                               {product.variants && product.variants.length > 0 ? (
                                 product.variants.map(variant => (
                                   <div key={variant.name}>
                                     {variant.name}: ${variant.price.toLocaleString()} (Stock: {variant.stock})
                                   </div>
                                 ))
                               ) : (
                                 // Mensaje si no hay variantes
                                 <div>Sin variantes</div>
                               )}
                           </td>
                           <td>
                                {/* Botón para abrir el modal de editar */}
                                 <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditModal(product)}>Editar</Button>
                                 {/* Botón para eliminar (llama a la función con confirmación toastify) */}
                                 <Button variant="danger" size="sm" onClick={() => handleDeleteClick(product.id, product.name)}>Eliminar</Button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </Table>
       )}

       {/* Renderiza el componente del modal */}
       <ProductFormModal
         show={showModal} // Controla la visibilidad
         onHide={handleCloseModal} // Función para cerrar
         onSubmit={handleFormSubmit} // Función llamada al enviar el formulario del modal
         isEditing={isEditing} // Indica si es edición o añadir
         initialData={currentProduct} // Pasa los datos iniciales si es edición
         isLoading={false} // Puedes añadir un estado de carga para el submit del modal si es necesario
         // isLoading={isSubmitting} // Si creas un estado isSubmitting en este componente
       />

    </div>
  );
}
