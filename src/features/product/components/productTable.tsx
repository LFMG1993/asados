// src/features/sales/components/product/ProductTable.tsx
// Este archivo ahora es la vista de gestión de productos completa

import React, { useEffect, useCallback, useState } from 'react';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import type { Product } from '../../../types/product.types';
import { useProducts } from '../hooks/useProducts'; // Asegúrate de la ruta correcta
import { toast } from 'react-toastify';

// Importa el componente del modal
import { ProductFormModal } from './productFormModal'; // Asegúrate de la ruta correcta


export function ProductTable() {
  // Llama al hook useProducts para obtener los datos, estado y funciones CRUD, incluyendo subida de imagen
  const {
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      refreshProducts,
      // ** Obtiene las funciones y estados de subida del hook **
      uploadProductImage,
      isUploadingImage,
      uploadProgress,
  } = useProducts();

  console.log("ProductTable (Management View) received from hook:", { products, loading, error, isUploadingImage, uploadProgress });


  // --- Estado para controlar el Modal ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
  // ** Estado local para indicar si la operación de submit del modal está en curso (añadir/editar) **
  const [isSubmittingModal, setIsSubmittingModal] = useState(false); // Para controlar la carga del submit principal


  // --- Funciones para abrir y cerrar el modal ---
  const handleShowAddModal = () => {
    setIsEditing(false);
    setCurrentProduct(undefined);
    setShowModal(true);
  };

  const handleShowEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentProduct(undefined);
     setIsSubmittingModal(false); // Limpia el estado de submit al cerrar el modal
  };

  // --- Función de envío del formulario en el modal (llamada desde ProductFormModal) ---
  const handleFormSubmit = async (productData: Omit<Product, 'id'> | Partial<Product>) => {
      console.log("ProductTable (Management View): handleFormSubmit called with data:", productData);
      // ** Establece el estado de submit antes de llamar al hook **
      setIsSubmittingModal(true);
      try {
          if (isEditing && 'id' in productData && productData.id) {
              console.log(`ProductTable (Management View): Calling updateProduct hook function for ID: ${productData.id}`);
              await updateProduct(productData.id, productData);
              toast.success(`Producto "${productData.name}" actualizado con éxito!`);
          } else {
               console.log("ProductTable (Management View): Calling addProduct hook function");
              await addProduct(productData as Omit<Product, 'id'>);
              toast.success(`Producto "${productData.name}" añadido con éxito!`);
          }
          // ** Cierra el modal y limpia el estado de submit después del éxito **
          handleCloseModal();
      } catch (err: any) {
         console.error("ProductTable (Management View): Error submitting product form:", err);
         toast.error(`Error al guardar producto: ${err.message}`);
         // ** Limpia el estado de submit en caso de error **
         setIsSubmittingModal(false);
         // El modal permanece abierto para que el usuario vea el error o intente de nuevo.
      }
  };

   // --- Función handleDeleteClick con confirmación en Toastify (sin cambios) ---
   const handleDeleteClick = async (productId: string, productName: string) => {
    console.log(`ProductTable (Management View): handleDeleteClick called for ID: ${productId}, Name: ${productName}`);
     toast.dismiss();

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
               console.log(`ProductTable (Management View): Calling deleteProduct hook function for ID: ${productId}`);
               await deleteProduct(productId);
               console.log("ProductTable (Management View): Product deleted via hook.");
               toast.success(`Producto "${productName}" eliminado con éxito!`);
             } catch (err: any) {
               console.error("ProductTable (Management View): Error in deleteProduct:", err);
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


  // ... (useEffect para error de carga inicial sin cambios)


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

       <Button onClick={handleShowAddModal} className="mb-3">Añadir Nuevo Producto</Button>

       {!loading && !error && (!products || products.length === 0) && (
         <Alert variant="info">
           No hay productos disponibles.
         </Alert>
       )}

       {!loading && !error && products && products.length > 0 && (
           <Table striped bordered hover responsive className="mt-3">
               <thead>
                   <tr>
                       <th>#</th>
                       <th>Imagen</th> {/* Columna para la imagen */}
                       <th>Nombre</th>
                       <th>Categoría</th>
                       <th>Descripción</th>
                       <th>Stock</th>
                       <th>Acciones</th>
                   </tr>
               </thead>
               <tbody>
                   {products.map((product, index) => (
                       <tr key={product.id}>
                           <td>{index + 1}</td>
                           {/* ** Muestra la imagen si imageUrl existe ** */}
                           <td>
                             {product.imageUrl ? (
                                 <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} className="img-thumbnail" />
                             ) : (
                                 <span>Sin imagen</span>
                             )}
                           </td>
                           <td>{product.name}</td>
                           <td>{product.category}</td>
                           <td>{product.description || 'Sin descripción'}</td>
                           <td>{product.currentStock} {product.stockUnit}</td>
                           <td>
                                 <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditModal(product)}>Editar</Button>
                                 <Button variant="danger" size="sm" onClick={() => handleDeleteClick(product.id, product.name)}>Eliminar</Button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </Table>
       )}

       {/* Renderiza el componente del modal */}
       <ProductFormModal
         show={showModal}
         onHide={handleCloseModal}
         onSubmit={handleFormSubmit} // La función que maneja el submit en este componente
         isEditing={isEditing}
         initialData={currentProduct}
         // ** Pasa las funciones y estados de subida de imagen del hook **
         uploadProductImage={uploadProductImage}
         isUploadingImage={isUploadingImage}
         uploadProgress={uploadProgress}
         // ** Pasa el estado de carga del submit del modal (combinando subida y operación BD) **
         isLoading={isUploadingImage || isSubmittingModal} // Combinamos carga de imagen y carga del submit
       />

    </div>
  );
}
