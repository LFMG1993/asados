// src/features/sales/components/product/ProductTable.tsx
// Este archivo ahora es la vista de gestión de productos completa

import React, { useEffect, useCallback, useState } from 'react'; // Importa useState
import { Table, Spinner, Alert, Button } from 'react-bootstrap'; // Asegúrate de importar los componentes necesarios
import type { Product } from '../../../types/product.types'; // Asegúrate de la ruta correcta a tus tipos
import { useProducts } from '../hooks/useProducts'; // Asegúrate de la ruta correcta a tu hook (sube 2 niveles, entra a hooks)
import { toast } from 'react-toastify';

// Importa el componente del modal
// Asegúrate de que esta ruta sea correcta desde product/ hasta donde tengas el modal
import { ProductFormModal } from './productFormModal'; // Ejemplo si ProductFormModal está en components/


// El componente ProductTable ahora gestiona el estado y renderiza la tabla y el modal
export function ProductTable() {
  // Llama al hook useProducts para obtener los datos, estado y funciones CRUD
  const { products, loading, error, addProduct, updateProduct, deleteProduct, refreshProducts } = useProducts();

  // ** AGREGAR ESTE LOG: Verificar los valores recibidos del hook **
  console.log("ProductTable (Management View) received from hook:", { products, loading, error });


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

  // Función para mostrar el modal de edición, llamada por el botón "Editar" en la tabla
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
  // Esta función recibe el objeto con los datos del formulario
  const handleFormSubmit = async (productData: Omit<Product, 'id'> | Partial<Product>) => {
      console.log("ProductTable (Management View): handleFormSubmit called with data:", productData); // Datos del formulario
      try {
          if (isEditing && 'id' in productData && productData.id) {
               console.log(`ProductTable (Management View): Calling updateProduct hook function for ID: ${productData.id}`);
              // Si estamos editando y tenemos el ID, llamamos a updateProduct del hook
              await updateProduct(productData.id, productData);
              toast.success(`Producto "${productData.name}" actualizado con éxito!`);
          } else {
               console.log("ProductTable (Management View): Calling addProduct hook function");
              // Si no estamos editando, llamamos a addProduct del hook
              await addProduct(productData as Omit<Product, 'id'>);
              toast.success(`Producto "${productData.name}" añadido con éxito!`);
          }
          handleCloseModal(); // Cierra el modal después del éxito
      } catch (err: any) {
         console.error("ProductTable (Management View): Error submitting product form:", err);
         // Puedes agregar un toast de error aquí si el error no se maneja ya en el hook
         // toast.error(`Error al guardar producto: ${err.message}`);
      }
  };

   // --- Función handleDeleteClick con confirmación en Toastify ---
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
               await deleteProduct(productId); // Llama a la función del hook
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


  // Opcional: Mostrar toast de error de carga inicial si error cambia
  // Puedes complementar el Alert con un toast si lo deseas
  useEffect(() => {
    if (error) {
       // toast.error(`Error al cargar productos: ${error.message}`);
       // Ya tenemos un Alert visible, un toast podría ser redundante aquí.
    }
  }, [error]); // Se ejecuta cuando el estado 'error' cambia


  // --- Renderizado ---

  // Si está cargando, muestra un indicador de carga
  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando productos...</span>
        </Spinner>
      </div>
    );
  }

  // Si hay un error, muestra un mensaje de error (y opcionalmente un toast)
  if (error) {
    return (
      <div className="mt-5">
        <Alert variant="danger">
          Error al cargar los productos: {error.message}
          {/* Botón para reintentar la carga */}
          <Button onClick={refreshProducts} className="ms-3" variant="outline-danger" size="sm">Reintentar</Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-4"> {/* Contenedor principal para la vista */}
       <h2>Gestión de Productos</h2> {/* Título de la vista */}

       {/* Botón para abrir el modal de añadir */}
       <Button onClick={handleShowAddModal} className="mb-3">Añadir Nuevo Producto</Button>

       {/* Muestra mensaje si no hay productos después de cargar */}
       {!loading && !error && (!products || products.length === 0) && (
         <Alert variant="info">
           No hay productos disponibles.
         </Alert>
       )}

       {/* Renderiza la tabla si hay productos y no hay carga/error */}
       {!loading && !error && products && products.length > 0 && (
           <Table striped bordered hover responsive className="mt-3"> {/* La tabla en sí */}
               <thead>
                   <tr>
                       <th>#</th>
                       <th>Nombre</th>
                       <th>Categoría</th>
                       <th>Descripción</th>
                       <th>Precio</th>
                       <th>Stock</th>
                       <th>Unidad</th>
                       <th>Imagen</th>
                       <th>Acciones</th>
                   </tr>
               </thead>
               <tbody>
                   {/* Mapea los productos obtenidos del hook */}
                   {products.map((product, index) => (
                       <tr key={product.id}>
                           <td>{index + 1}</td>
                           <td>{product.name}</td>
                           <td>{product.category}</td>
                           <td>{product.description || 'Sin descripción'}</td>
                           <td>{product.price}</td>
                           <td>{product.currentStock}</td>
                           <td>{product.stockUnit}</td>
                           <td>{product.imageUrl || 'Sin imagen'}</td>
                           
                           <td>
                                {/* Botones de acción llaman a las funciones definidas en este componente */}
                                 <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowEditModal(product)}>Editar</Button>
                                 <Button variant="danger" size="sm" onClick={() => handleDeleteClick(product.id, product.name)}>Eliminar</Button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </Table>
       )}

       {/* Renderiza el componente del modal (ProductFormModal) */}
       <ProductFormModal
         show={showModal} // Controla la visibilidad con el estado local
         onHide={handleCloseModal} // Función para cerrar
         onSubmit={handleFormSubmit} // Función que se llama al enviar el formulario del modal
         isEditing={isEditing} // Indica si es edición o añadir
         initialData={currentProduct} // Pasa los datos iniciales si es edición
         isLoading={false} // Ajusta si gestionas estado de carga del submit
       />

    </div>
  );
}
