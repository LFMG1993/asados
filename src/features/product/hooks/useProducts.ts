// src/features/sales/hooks/useProducts.ts

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../../types/product.types'; // Asegúrate de la ruta correcta a tus tipos
import {
  getProducts,
  addProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
  // ** IMPORTA AQUÍ LA FUNCIÓN PARA SUBIR IMAGEN DESDE EL SERVICIO **
  uploadProductImage
} from '../services/productService'; // Asegúrate de la ruta correcta a tu servicio

// Define los tipos para las funciones que el hook va a exponer
type AddProductFn = (productData: Omit<Product, 'id'>) => Promise<string>;
type UpdateProductFn = (productId: string, updateData: Partial<Product>) => Promise<void>;
type DeleteProductFn = (productId: string) => Promise<void>;

// ** DEFINE UN TIPO PARA LA FUNCIÓN DE SUBIDA DE IMAGEN EN EL HOOK **
// Esta función tomará el archivo, opcionalmente el ID del producto (para nombrar el archivo),
// y un callback opcional para el progreso. Devolverá la URL de descarga.
type UploadProductImageFn = (file: File, productId?: string, onProgress?: (progress: number) => void) => Promise<string>;


interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | null;
  addProduct: AddProductFn;
  updateProduct: UpdateProductFn;
  deleteProduct: DeleteProductFn;
  refreshProducts: () => Promise<void>;
  // ** AGREGA AQUÍ LA FUNCIÓN DE SUBIDA DE IMAGEN Y SUS ESTADOS **
  uploadProductImage: UploadProductImageFn; // La función que se usará en el modal
  isUploadingImage: boolean; // Estado para saber si se está subiendo una imagen
  uploadProgress: number; // Progreso de la subida (0-100)
}

export function useProducts(): UseProductsResult {
  console.log("useProducts hook is running"); // Log para depuración

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // ** ESTADOS PARA LA SUBIDA DE IMAGEN **
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);


  // Función para obtener los productos, envuelta en useCallback
  const fetchProducts = useCallback(async () => {
    console.log("Hook: fetchProducts is being called"); // Log para depuración
    try {
      setLoading(true);
      const productsData = await getProducts(); // Llama al servicio
      console.log("Hook: Data received from service:", productsData); // Log datos recibidos
      setProducts(productsData);
      console.log("Hook: Products state set."); // Log estado actualizado
    } catch (err: any) {
      console.error("Hook: Error fetching products:", err); // Log errores
      setError(err);
      setProducts([]); // Limpia la lista en caso de error
    } finally {
      setLoading(false); // Finaliza carga
      console.log("Hook: fetchProducts finished. Loading:", false); // Log estado final
    }
  }, [getProducts]); // Dependencia del servicio para useCallback

  // useEffect para cargar productos al montar el componente
  useEffect(() => {
    console.log("Hook: useEffect in useProducts is running"); // Log para depuración
    fetchProducts(); // Dispara la carga inicial
    // No necesitas una función de limpieza aquí a menos que implementes
    // suscripciones en tiempo real que debas detener.
  }, [fetchProducts]); // Dependencia de fetchProducts

  // ** IMPLEMENTACIÓN DE LA FUNCIÓN DE SUBIDA DE IMAGEN EN EL HOOK **
  const uploadProductImageHook: UploadProductImageFn = useCallback(async (file, productId, onProgress) => {
      console.log("Hook: uploadProductImage called with file:", file, "productId:", productId); // Log llamada

      setIsUploadingImage(true); // Inicia el estado de subida
      setUploadProgress(0); // Reinicia el progreso

      try {
          // Genera un nombre de archivo único en Storage
          // Si hay un productId, úsalo para nombrar el archivo.
          // Si no, usa un timestamp. Añade la extensión original del archivo.
          const filename = productId ? `${productId}_${Date.now()}.${file.name.split('.').pop()}` : `new_product_${Date.now()}.${file.name.split('.').pop()}`;
          console.log("Hook: Generated filename for Storage:", filename);

          // Llama a la función de subida del servicio
          // Pasa el archivo, el nombre del archivo generado y un callback para el progreso
          const downloadURL = await uploadProductImage(filename, file, (progress) => {
              setUploadProgress(Math.round(progress)); // Actualiza el estado de progreso (redondeado)
              if(onProgress) onProgress(progress); // Llama al callback de progreso opcional pasado al hook
          });

          console.log("Hook: Image upload service completed. Download URL:", downloadURL);

          setIsUploadingImage(false); // Finaliza el estado de subida exitosamente
          setUploadProgress(100); // Asegura que el progreso llegue a 100% al finalizar

          return downloadURL; // Devuelve la URL de descarga

      } catch (err: any) {
          console.error("Hook: Error uploading image:", err); // Log errores de subida
          setIsUploadingImage(false); // Finaliza el estado de subida con error
          setUploadProgress(0); // Reinicia el progreso en caso de error
          // Puedes agregar un toast de error aquí si el modal no lo maneja explícitamente
          // toast.error(`Error al subir imagen: ${err.message}`);
          throw err; // Re-lanza el error para que el componente que llama pueda manejarlo
      }
  }, [uploadProductImage]); // Depende de la función del servicio


  // Funciones CRUD (no necesitan cambios significativos aquí, ya que manejan el tipo Product)
  const addProduct: AddProductFn = useCallback(async (productData) => {
    console.log("Hook: addProduct called with data (should have imageUrl):", productData);
    try {
      // Asume que productData.imageUrl contiene la URL de descarga (si se subió imagen)
      const newProductId = await addProductService(productData);
      const newProduct: Product = { ...productData, id: newProductId };
      setProducts(prevProducts => [...prevProducts, newProduct]);
      console.log("Hook: Products state updated optimistically after add.");
      return newProductId;
    } catch (err) {
      console.error("Hook: Error in addProduct:", err);
      throw err;
    }
  }, [addProductService]);

  const updateProduct: UpdateProductFn = useCallback(async (productId, updateData) => {
    console.log(`Hook: updateProduct called for ID: ${productId}, Data (should have imageUrl if changed):`, updateData);
    try {
      // Asume que updateData.imageUrl contiene la nueva URL (si se subió imagen)
      // o "" si se eliminó la imagen existente.
      await updateProductService(productId, updateData);
      console.log("Hook: Product updated via service.");
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === productId ? { ...product, ...updateData as Product } : product // Usar as Product si updateData es parcial
        )
      );
       console.log("Hook: Products state updated optimistically after update.");
    } catch (err) {
      console.error("Hook: Error in updateProduct:", err);
      throw err;
    }
  }, [updateProductService]);

  const deleteProduct: DeleteProductFn = useCallback(async (productId) => {
    console.log("Hook: deleteProduct called for ID:", productId);
    try {
      // Opcional: Si implementaste la eliminación de imagen en el servicio, podrías llamarla aquí
      // antes de eliminar el documento de Firestore. Necesitarías obtener la imageUrl del producto primero.
      // const productToDelete = products.find(p => p.id === productId);
      // if (productToDelete?.imageUrl) {
      //    await deleteProductImage(productToDelete.imageUrl); // Necesitas exportar deleteProductImage del servicio e importarla
      // }

      await deleteProductService(productId);
      setProducts(prevProducts =>
        prevProducts.filter(product => product.id !== productId)
      );
      console.log("Hook: Products state updated optimistically after delete.");
    } catch (err) {
      console.error("Hook: Error in deleteProduct:", err);
      throw err;
    }
  }, [deleteProductService]);


  const refreshProducts = useCallback(async () => {
      console.log("Hook: refreshProducts called.");
      await fetchProducts();
  }, [fetchProducts]);


  console.log("useProducts returning:", { products, loading, error, isUploadingImage, uploadProgress });

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    // ** EXPORTA AQUÍ LA FUNCIÓN DE SUBIDA DE IMAGEN Y SUS ESTADOS **
    uploadProductImage: uploadProductImageHook, // Exporta la función del hook
    isUploadingImage, // Exporta el estado de subida
    uploadProgress, // Exporta el progreso
  };
}
